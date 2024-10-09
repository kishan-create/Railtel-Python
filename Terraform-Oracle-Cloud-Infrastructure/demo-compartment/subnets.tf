resource "oci_core_subnet" "sub-vcn-tf1" {
  cidr_block                 = var.vcn_sub_cidr
  display_name               = "sub-${var.client_prefix}-${var.subnet_prefix}"
  dns_label                  = "sub"
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_virtual_network.vcn-tf1.id
  security_list_ids          = ["${oci_core_security_list.sl-vcn-tf1.id}"]
  route_table_id             = oci_core_route_table.rt-vcn-tf1.id
  prohibit_public_ip_on_vnic = "true"
  //defined_tags               = { "Tags1.tag" = "value" }
  //dhcp_options_id     = oci_core_dhcp_options.dhcp_options_1.id
}
/*
resource "oci_core_dhcp_options" "dhcp_options_1" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_virtual_network.vcn-tf1.id
  display_name   = "dhcpOptions1"

// required
  options {
    type               = "DomainNameServer"
    server_type        = "CustomDnsServer"
    custom_dns_servers = ["10.1.0.3"]
  }

  // optional
  options {
    type                = "SearchDomain"
    search_domain_names = [format("%s.%s.oraclevcn.com",var.subnet_prefix,var.client_prefix)]
  }
}
*/