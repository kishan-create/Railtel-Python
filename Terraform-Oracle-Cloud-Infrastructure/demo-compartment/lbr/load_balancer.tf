
resource oci_load_balancer_load_balancer create_lbr {
  compartment_id = var.compartment_ocid
  display_name = var.lb_name
  freeform_tags = {
  }
  ip_mode    = "IPV4"
  is_private = "false"
  network_security_group_ids = [
  ]
  shape = "flexible"
  shape_details {
    maximum_bandwidth_in_mbps = "10"
    minimum_bandwidth_in_mbps = "10"
  }
  subnet_ids = [ var.subnet_id ]
}

resource oci_load_balancer_backend_set create_backend_set {
  health_checker {
    interval_ms = "10000"
    port                = "80"
    protocol            = "TCP"
    response_body_regex = ""
    retries             = "3"
    return_code         = "200"
    timeout_in_millis   = "3000"
    url_path            = "/"
  }
  load_balancer_id = oci_load_balancer_load_balancer.create_lbr.id
  name             = var.backend_set_name
  policy           = "ROUND_ROBIN"
}

resource oci_load_balancer_backend add_ip_backend_set {
  for_each         = var.priv_ip_info
  backendset_name  = oci_load_balancer_backend_set.create_backend_set.name
  backup           = "false"
  drain            = "false"
  ip_address       = lookup(var.priv_ip_info[each.key], "ip_details")
  load_balancer_id = oci_load_balancer_load_balancer.create_lbr.id
  offline          = "false"
  port             = "80"
  weight           = "1"
}

resource oci_load_balancer_listener create_listener {
  connection_configuration {
    backend_tcp_proxy_protocol_version = "0"
    idle_timeout_in_seconds            = "60"
  }
  default_backend_set_name = oci_load_balancer_backend_set.create_backend_set.name
  hostname_names = [
  ]
  load_balancer_id = oci_load_balancer_load_balancer.create_lbr.id
  name             = var.lbr_listener_name
  port     = "80"
  protocol = "HTTP"
  rule_set_names = [
  ]
}

