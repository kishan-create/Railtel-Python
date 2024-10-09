resource "oci_core_nat_gateway" "nat-vcn-tf1" {
  compartment_id = var.compartment_ocid
  display_name   = "nat-${var.client_prefix}-${var.subnet_prefix}"
  vcn_id         = oci_core_virtual_network.vcn-tf1.id
  //defined_tags   = { "tags1.tag" = "value" }
}

data "oci_core_services" "all_services" {
  filter {
    name   = "name"
    values = ["All .* Services In Oracle Services Network"]
    regex  = true
  }
}

# Service Gateway
resource "oci_core_service_gateway" "sg-vcn-tf1" {
  #Required
  compartment_id = var.compartment_ocid
  services {
    service_id = lookup(data.oci_core_services.all_services.services[0], "id")
  }
  vcn_id       = oci_core_virtual_network.vcn-tf1.id
  display_name = "sg-${var.client_prefix}-${var.subnet_prefix}"
  //defined_tags   = { "tags1.tag" = "value" }
}

# LPG : VCN-TF1 to VPN
resource "oci_core_local_peering_gateway" "lpg-vcn-tf1-to-vpn" {
  #Required
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_virtual_network.vcn-tf1.id

  #Optional
  display_name = "lpg-${var.client_prefix}-${var.subnet_prefix}-to-vpn"
  //defined_tags   = { "tags1.tag" = "value" }
  //peer_id      = "${oci_core_local_peering_gateway.lg-vcn-vpn.id}"
}

# LPG : VCN-TF1 to ADMIN NETWORK 
resource "oci_core_local_peering_gateway" "lpg-vcn-tf1-to-adm" {
  #Required
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_virtual_network.vcn-tf1.id

  #Optional
  display_name = "lpg-${var.client_prefix}-${var.subnet_prefix}-to-adm"
  //defined_tags   = { "tags1.tag" = "value" }
  //peer_id      = "${oci_core_local_peering_gateway.lg-vcn-adm.id}"
}