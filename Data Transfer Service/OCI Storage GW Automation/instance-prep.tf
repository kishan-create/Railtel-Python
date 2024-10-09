resource oci_core_instance create_instance_proc {
  availability_domain = var.ad_availability_domain
  compartment_id = var.compartment_ocid
  create_vnic_details {
    assign_public_ip = var.vnic_assign_public_ip
    display_name = var.instance_display_name
    freeform_tags = {
    }
    hostname_label = var.instance_display_name
    
    nsg_ids = [
    ]
    subnet_id              = var.subnet_id
  }
  display_name = var.instance_display_name
  fault_domain = var.instance_fault_domain
  launch_options {
    boot_volume_type = var.instance_launch_options_boot_volume_type
    firmware = var.instance_launch_options_firmware
    is_consistent_volume_naming_enabled = var.instance_launch_options_is_consistent_volume_naming_enabled
    is_pv_encryption_in_transit_enabled = var.instance_launch_options_is_pv_encryption_in_transit_enabled
    network_type = var.instance_launch_options_network_type
    remote_data_volume_type = var.instance_launch_options_remote_data_volume_type
}
  metadata = {
    ssh_authorized_keys = file("${var.opc_ssh_public_key}")
  }
  shape = var.instance_shape
  shape_config {
    baseline_ocpu_utilization = var.instance_shape_config_baseline_ocpu_utilization
    memory_in_gbs = var.instance_shape_config_memory_in_gbs
    ocpus = var.instance_shape_config_ocpus
}
  source_details {
    boot_volume_vpus_per_gb = var.instance_source_details_boot_volume_vpus_per_gb
    source_id   = var.image_id
    source_type = "image"
  }
  state = "RUNNING"
}

resource oci_core_volume create_volume_proc {
  availability_domain = var.ad_availability_domain
  compartment_id = var.compartment_ocid
  display_name = var.volume_display_name
  is_auto_tune_enabled = var.volume_is_auto_tune_enabled
  size_in_gbs = var.volume_size_in_gbs
  vpus_per_gb = var.volume_vpus_per_gb
}

resource oci_core_volume_attachment create_volumeattachment_proc {
  attachment_type = var.volume_attachment_attachment_type
  device          = var.volume_attachment_device
  display_name    = var.volume_attachment_display_name
  instance_id = oci_core_instance.create_instance_proc.id
  is_pv_encryption_in_transit_enabled = var.volume_attachment_is_pv_encryption_in_transit_enabled
  is_read_only = var.volume_attachment_is_read_only
  volume_id = oci_core_volume.create_volume_proc.id
  depends_on = [oci_core_instance.create_instance_proc]
}

resource "null_resource" "storage_gw_install" {
    connection {
      agent       = false
      timeout     = "30m"
      host        = oci_core_instance.create_instance_proc.public_ip
      user        = "opc"
      private_key = file("${var.opc_ssh_private_key}")
    }
   provisioner "file" {
    source      = var.source_details
    destination = var.destination_details
  }
   provisioner "remote-exec" {
    inline = [
          "chmod +x /tmp/install.sh",
          "sudo /tmp/install.sh",
      ]
   }
   depends_on = [oci_core_volume_attachment.create_volumeattachment_proc]
}

output "public_ip" {
  value = oci_core_instance.create_instance_proc.public_ip
  description = "User the format https://public_ip:32770 to login into Storage GW"
}

