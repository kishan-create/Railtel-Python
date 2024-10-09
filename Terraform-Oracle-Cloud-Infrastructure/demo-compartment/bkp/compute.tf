resource "oci_core_instance" "createInstance" {
  for_each = var.compute_info
  #availability_domain = var.compute_availability_domain
  availability_domain = var.system_availability_domain[lookup(var.compute_info[each.key], "compute_ad_name")]
  compartment_id      = var.compartment_ocid
  display_name        = lookup(var.compute_info[each.key], "compute_hostname")
  shape               = lookup(var.compute_info[each.key], "compute_shape")

  create_vnic_details {
    subnet_id        = oci_core_subnet.sub-vcn-tf1.id
    display_name     = "Primaryvnic"
    assign_public_ip = false
    hostname_label   = lookup(var.compute_info[each.key], "compute_hostname")
  }

  source_details {
    source_type             = "image"
    source_id               = var.instance_image_ocid[var.region]
    boot_volume_size_in_gbs = lookup(var.compute_info[each.key], "compute_boot_volume_size")
  }

  metadata = {
    ssh_authorized_keys = file("${var.opc_ssh_public_key}")
    user_data           = "${base64encode(file("./cloudinit/compute_bootstrap"))}"
  }

  //defined_tags = { "tags1.tag" = "Value" }
  timeouts {
    create = "60m"
  }
}

resource "null_resource" "remote-exec" {
  for_each = var.compute_info

  // add public key to ahtorized_keys OPC user
  provisioner "file" {
    connection {
      agent       = false
      timeout     = "30m"
      host        = oci_core_instance.createInstance[each.key].private_ip
      user        = "opc"
      private_key = file("${var.opc_ssh_private_key}")
    }
    source      = var.compute_ssh_authorized_keys
    destination = "/home/opc/.ssh/authorized_keys"
  }
  triggers = {
    md5 = filemd5(var.compute_ssh_authorized_keys)
  }
}

####################
# Volume Create
####################
resource "oci_core_volume" "createVolume" {
  for_each            = var.compute_info
  availability_domain = var.system_availability_domain[lookup(var.compute_info[each.key], "compute_ad_name")]
  compartment_id      = var.compartment_ocid
  display_name        = lookup(var.compute_info[each.key], "compute_dataVolumeName")
  size_in_gbs         = lookup(var.compute_info[each.key], "compute_dataVolumeSize")
  //defined_tags = { "tags1.tag" = "Value" }
}

####################
# Volume Attachment
####################
resource "oci_core_volume_attachment" "attachVolume" {
  for_each        = var.compute_info
  attachment_type = var.attachment_type
  instance_id     = oci_core_instance.createInstance[each.key].id
  volume_id       = oci_core_volume.createVolume[each.key].id
}

####################
# Volume Attachment shareable
####################
/*
resource "oci_core_instance" "createInstanceTest" {
  for_each = var.compute_test_info
  #availability_domain = var.compute_availability_domain
  availability_domain = var.system_availability_domain[lookup(var.compute_test_info[each.key], "compute_ad_name")]
  compartment_id      = var.compartment_ocid
  display_name        = lookup(var.compute_test_info[each.key], "compute_hostname")
  shape               = lookup(var.compute_test_info[each.key], "compute_shape")

  create_vnic_details {
    subnet_id        = oci_core_subnet.sub-tf1.id
    display_name     = "Primaryvnic"
    assign_public_ip = false
    hostname_label   = lookup(var.compute_test_info[each.key], "compute_hostname")
  }

  source_details {
    source_type             = "image"
    source_id               = var.instance_image_ocid[var.region]
    boot_volume_size_in_gbs = lookup(var.compute_test_info[each.key], "compute_boot_volume_size")
  }

  metadata = {
    ssh_authorized_keys = file("${var.opc_ssh_public_key}")
    user_data           = "${base64encode(file("./cloudinit/compute_bootstrap"))}"
  }

  defined_tags = { "tags1.tag" = "Value" }
  timeouts {
    create = "60m"
  }
}

resource "oci_core_volume" "createVolumeISCI" {
  availability_domain = var.system_availability_domain["us-ashburn-1"]
  compartment_id      = var.compartment_ocid
  display_name        = "test_data"
  size_in_gbs         = 50
  defined_tags = { "tags1.tag" = "Value" }
}
*/
/*resource "oci_core_volume_attachment" "attachVolumeISCI" {
  for_each        = var.compute_test_info
  attachment_type = var.attachment_type_shareable
  instance_id     = oci_core_instance.createInstanceTest[each.key].id
  volume_id       = oci_core_volume.createVolumeISCI[each.key].id
  is_shareable    = true
}*/

####################
# Backup Policies
####################
data "oci_core_volume_backup_policies" "get_predefined_volume_backup_policies" {
  filter {
    name   = "display_name"
    values = ["bronze", "silver", "gold"]
  }
}

# Create a map variable: display_name:id of backup policies
locals {
  association-list = {
    for vbp in data.oci_core_volume_backup_policies.get_predefined_volume_backup_policies.volume_backup_policies :
    vbp["display_name"] => vbp["id"]
  }
}

resource "oci_core_volume_backup_policy_assignment" "assignBackupPolicies" {
  for_each  = var.compute_info
  asset_id  = oci_core_volume.createVolume[each.key].id
  policy_id = local.association-list[lookup(var.compute_info[each.key], "compute_backupPolicies", var.backupPolicies)]
}
