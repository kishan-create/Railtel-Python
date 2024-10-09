resource "oci_core_route_table" "rt-vcn-tf1" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_virtual_network.vcn-tf1.id
  display_name   = "rt-${var.client_prefix}-${var.subnet_prefix}"
  //defined_tags   = { "tags1.tag" = "value" }

  # Route all trafic to nat GW 
  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_nat_gateway.nat-vcn-tf1.id
  }

  # Route trafic to admin network to LPG
  route_rules {
    destination       = "10.1.0.0/23"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_local_peering_gateway.lpg-vcn-tf1-to-adm.id
  }

  # Route trafic to VPN to LPG
  route_rules {
    destination       = "20.0.0.0/8"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_local_peering_gateway.lpg-vcn-tf1-to-vpn.id
  }

  # Rules to route -> Service Oracle (backup, yum...)
  route_rules {
    destination       = lookup(data.oci_core_services.all_services.services[0], "cidr_block")
    destination_type  = "SERVICE_CIDR_BLOCK"
    network_entity_id = oci_core_service_gateway.sg-vcn-tf1.id
  }
}

