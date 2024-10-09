resource "oci_identity_group" "admin-app" {
  name           = "tf-admin-group"
  description    = "group created by terraform"
  compartment_id = var.compartment_ocid
}

data "oci_identity_groups" "groups1" {
  compartment_id = "${oci_identity_group.admin-app.compartment_id}"

  filter {
    name   = "name"
    values = ["tf-admin-group"]
  }
}

output "groups" {
  value = "${data.oci_identity_groups.groups1.groups}"
}

/*
 * Some more directives to show dynamic groups and policy for it
 */

variable "dynamic_group_defined_tags_value" {
  default = "value"
}

variable "dynamic_group_freeform_tags" {
  default = {
    "Department" = "JavaApplication"
  }
}

resource "oci_identity_dynamic_group" "enable-marketplace" {
  compartment_id = var.compartment_ocid
  name           = "tf-enable-marketplace-group"
  description    = "dynamic group created by terraform"
  matching_rule  = "ALL {instance.compartment.id = '${data.oci_identity_compartments.compartments1.compartments.0.id}'}"

  #Optional
  //defined_tags  = "${map("${oci_identity_tag_namespace.tag-namespace1.name}.${oci_identity_tag.tag1.name}", "${var.dynamic_group_defined_tags_value}")}"
  freeform_tags = var.dynamic_group_freeform_tags
}

data "oci_identity_dynamic_groups" "mkt-dyn-group" {
  compartment_id = var.compartment_ocid

  filter {
    name   = "id"
    values = ["${oci_identity_dynamic_group.enable-marketplace.id}"]
  }
}

output "mktDynGroups" {
  value = "${data.oci_identity_dynamic_groups.mkt-dyn-group.dynamic_groups}"
}


## Create a Dynamic group, with instance.id as matching
resource "oci_identity_dynamic_group" "enable-osms" {
  compartment_id = var.compartment_ocid
  name           = "enable-osms"
  description    = "Add enable-osms instance to dynamic group"

  # Matching rules
  # * instance id
  matching_rule = "ANY {instance.compartment.id = '${data.oci_identity_compartments.compartments1.compartments.0.id}'}"

  freeform_tags = {
    "TF-Module"   = "no"
    "Terraformed" = "yes"
  }
  //depends_on = [module.inst_enable-osms]
}

data "oci_identity_dynamic_groups" "osms-dyn-group" {
  compartment_id = var.compartment_ocid

  filter {
    name   = "id"
    values = ["${oci_identity_dynamic_group.enable-osms.id}"]
  }
}

output "osmsDynGroups" {
  value = "${data.oci_identity_dynamic_groups.osms-dyn-group.dynamic_groups}"
}