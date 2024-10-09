resource "oci_core_virtual_network" "vcn-tf1" {
  cidr_block     = var.vcn_cidr
  dns_label      = var.client_prefix
  compartment_id = var.compartment_ocid
  display_name   = "vcn-${var.client_prefix}-${var.subnet_prefix}"
  //defined_tags   = { "tags1.tag" = "value" }
}
