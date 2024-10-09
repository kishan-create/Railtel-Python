resource "oci_core_security_list" "sl-vcn-tf1" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_virtual_network.vcn-tf1.id
  display_name   = "sl-${var.client_prefix}-${var.subnet_prefix}"
  //defined_tags   = { "tags1.tag" = "value" }

  // allow outbound tcp traffic on all ports
  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "6" // tcp
  }
  // allow ping for current network
  egress_security_rules {
    destination = "10.0.0.0/16"
    protocol    = "1"
  }

  // allow inbound ssh traffic from a specific port and from admin network
  ingress_security_rules {
    protocol  = "6" // tcp
    source    = "10.1.0.0/23"
    stateless = false

    tcp_options {
      // These values correspond to the destination port range.
      min = 22
      max = 22
    }
  }

  # disable filtering for current network on WLS default ssl port
  ingress_security_rules {
    protocol  = "6" // tcp
    source    = "10.0.0.0/16"
    stateless = false

    tcp_options {
      // These values correspond to the destination port range.
      min = 7002
      max = 7002
    }
  }
  # disable filtering for current network on WLS managed server default ssl port
  ingress_security_rules {
    protocol  = "6" // tcp
    source    = "10.0.0.0/16"
    stateless = false

    tcp_options {
      // These values correspond to the destination port range.
      min = 9074
      max = 9074
    }
  }

  // Open ssl port
  ingress_security_rules {
    protocol  = "6" // tcp
    source    = "10.0.0.0/16"
    stateless = false

    tcp_options {
      // These values correspond to the destination port range.
      min = 443
      max = 443
    }
  }

  // Open Oracle listener port
  ingress_security_rules {
    protocol  = "6" // tcp
    source    = "10.0.0.0/16"
    stateless = false

    tcp_options {
      // These values correspond to the destination port range.
      min = 1521
      max = 1521
    }
  }
  // Open Oracle ONS port
  ingress_security_rules {
    protocol  = "6" // tcp
    source    = "10.0.0.0/16"
    stateless = false

    tcp_options {
      // These values correspond to the destination port range.
      min = 6200
      max = 6200
    }
  }

  // allow inbound icmp traffic of a specific type
  ingress_security_rules {
    protocol  = 1
    source    = "10.0.0.0/8"
    stateless = true

    /*icmp_options {
      type = 3
      code = 4
    }*/
  }
}

