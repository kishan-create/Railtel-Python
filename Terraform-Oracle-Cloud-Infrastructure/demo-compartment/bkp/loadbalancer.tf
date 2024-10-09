/*
data "oci_core_subnet" "get_sub-vcn-tf1" {
  subnet_id = oci_core_subnet.sub-vcn-tf1.id
}
*/

resource "oci_load_balancer" "createLB" {
  for_each       = var.lb_info
  shape          = "100Mbps"
  compartment_id = var.compartment_ocid
  subnet_ids = [
    oci_core_subnet.sub-vcn-tf1.id,
  ]
  display_name = each.value.lb_hostname
  is_private   = true
}

### create local variables to get all resource to create
locals {
  # Cartesian rule for create a Map for each LB and each backend set (backends, bkend_port, policy...)
  listOf_lb_bs = flatten([for lb_key, lb in var.lb_info : [for bs_key, bs in lb.backendSet : { format("%s_%s", lb_key, bs_key) = bs }]])
  # for each LB_backendset, create a new map (backends, bkend_port, policy...)
  mapOf_lb_bs = { for lb_bs in local.listOf_lb_bs : keys(lb_bs)[0] => values(lb_bs)[0] }

  # each Backend for each backend-set map (be_bs) for a map (be, lb, bs, port)
  listeOf_lb_bs_be = flatten([for lb_bs_key, lb_bs in local.mapOf_lb_bs :
    [for be_key in lb_bs.backends :
      { format("%s_%s", be_key, split("_", lb_bs_key)[1]) = { be = be_key, lb = split("_", lb_bs_key)[0], lb_bs = lb_bs_key, port = lb_bs.bkend_port } }
  ]])
  # map within map transformation
  mapOf_lb_bs_be = { for lb_bs_be in local.listeOf_lb_bs_be : keys(lb_bs_be)[0] => values(lb_bs_be)[0] }

  #  map for each each and TCP listener (protocol, listen-port)
  listOf_lb_lstn_TCP = flatten([for lb_key, lb in var.lb_info : [for lstn_key, lstn in lb.listeners.lstn_TCP : { format("%s_%s", lb_key, lstn_key) = lstn }]])
  mapOf_lb_lstn_TCP  = { for lb_lstn in local.listOf_lb_lstn_TCP : keys(lb_lstn)[0] => values(lb_lstn)[0] }

  # map for each LB and each http listener associated (protocol, listen port, Path route set, ...)
  listOf_lb_lstn_HTTP = flatten([for lb_key, lb in var.lb_info : [for lstn_key, lstn in lb.listeners.lstn_HTTP : { format("%s_%s", lb_key, lstn_key) = lstn }]])
  mapOf_lb_lstn_HTTP  = { for lb_lstn in local.listOf_lb_lstn_HTTP : keys(lb_lstn)[0] => values(lb_lstn)[0] }

  listOf_lb_prs = flatten([for lb_key, lb in var.lb_info : [for prs_key, prs in lb.prs : { format("%s_%s", lb_key, prs_key) = prs }]])
  mapOf_lb_prs = { for lb_prs in local.listOf_lb_prs :
    keys(lb_prs)[0] => flatten([for lb_prs_value in values(lb_prs)[0] :
      flatten([for lb_prs_path_keys, lb_prs_path in values(lb_prs_value)[0] :
        { format("%s_%s", keys(lb_prs_value)[0], lb_prs_path_keys) = lb_prs_path }
  ])]) }

  listOf_lb_rs = flatten([for lb_key, lb in var.lb_info : [for rs_key, rs in lb.rules : { format("%s_%s", lb_key, rs_key) = rs }]])
  mapOf_lb_rs  = { for lb_rs in local.listOf_lb_rs : keys(lb_rs)[0] => values(lb_rs)[0] }

  listOf_lb_cert = flatten([for lb_key, lb in var.lb_info : [for cert_key, cert in lb.certificates : { format("%s_%s", lb_key, cert_key) = cert }]])
  mapOf_lb_cert  = { for lb_rs in local.listOf_lb_cert : keys(lb_rs)[0] => values(lb_rs)[0] }
}

output "map_all_backendSet" {
  value = local.mapOf_lb_bs
}

output "map_all_backend" {
  value = local.mapOf_lb_bs_be
}

output "map_all_listener_TCP" {
  value = local.mapOf_lb_lstn_TCP
}

output "map_all_listener_HTTP" {
  value = local.mapOf_lb_lstn_HTTP
}

output "map_all_Path_Route_Set" {
  value = local.mapOf_lb_prs
}

output "map_all_Rules_Set" {
  value = local.mapOf_lb_rs
}

output "map_all_Certificate" {
  value = local.mapOf_lb_cert
}
### END Locals

resource "oci_load_balancer_hostname" "lb-vhostname" {
  for_each         = local.mapOf_lb_lstn_HTTP
  hostname         = each.value.vhostname
  load_balancer_id = oci_load_balancer.createLB[split("_", each.key)[0]].id
  name             = each.value.vhostname
}

####  create backend set for each LB
resource "oci_load_balancer_backend_set" "lb-bs" {
  # for_each         = toset(flatten([for lb in var.lb_info : [for bs, cfg in lb.backendSet : bs => cfg ]]))
  for_each         = { for key, value in local.mapOf_lb_bs : key => value if length(value.cert) == 0 }
  name             = each.key
  load_balancer_id = oci_load_balancer.createLB[split("_", each.key)[0]].id
  policy           = each.value.policy
  health_checker {
    port     = each.value.bkend_port # ERO: var.lb_info[each.key].listeners.ltn_UnSecure.bks_port
    protocol = "TCP"
  }
}

##  create backend set for each LB with SSL
resource "oci_load_balancer_backend_set" "lb-bs-ssl" {
  # for_each         = toset(flatten([for lb in var.lb_info : [for bs, cfg in lb.backendSet : bs => cfg ]]))
  for_each = { for key, value in local.mapOf_lb_bs : key => value if length(value.cert) > 0 }

  name             = each.key
  load_balancer_id = oci_load_balancer.createLB[split("_", each.key)[0]].id
  policy           = each.value.policy

  session_persistence_configuration {
    cookie_name = "*"
    #count = "${length(each.value.cert) >0 ? 1 : 0}"
    disable_fallback = false
  }
  ssl_configuration {
    # count = "${length(each.value.cert) >0 ? 1 : 0}"
    #Required
    certificate_name = length(each.value.cert) > 0 ? var.lb_info[split("_", each.key)[0]].certificates[each.value.cert].name : null
    #Optional
    verify_depth            = "1"
    verify_peer_certificate = "false"
  }
  health_checker {
    port     = each.value.bkend_port # ERO: var.lb_info[each.key].listeners.ltn_UnSecure.bks_port
    protocol = "TCP"
  }
}

### END create backend set for each LB

### Create backend for each backend set
resource "oci_load_balancer_backend" "lb-be" {
  for_each         = local.mapOf_lb_bs_be
  backendset_name  = each.value.lb_bs
  ip_address       = oci_core_instance.createInstance[each.value.be].private_ip
  load_balancer_id = oci_load_balancer.createLB[each.value.lb].id
  port             = each.value.port
}
### END Create backend for each backend set

### Create TCP listener
resource "oci_load_balancer_listener" "lblsnr-tcp" {
  for_each = local.mapOf_lb_lstn_TCP
  #Required
  default_backend_set_name = format("%s_%s", split("_", each.key)[0], each.value.bs_default)
  load_balancer_id         = oci_load_balancer.createLB[split("_", each.key)[0]].id
  name                     = each.key
  port                     = each.value.ltn_port
  protocol                 = each.value.proto

  #Optional
  connection_configuration {
    #Required
    idle_timeout_in_seconds = var.listener_connection_configuration_idle_timeout_in_seconds
  }
}
### END 

### Create certificate and rules Set
resource "oci_load_balancer_rule_set" "lb_rs" {
  for_each         = local.mapOf_lb_rs
  load_balancer_id = oci_load_balancer.createLB[split("_", each.key)[0]].id
  name             = split("_", each.key)[1]
  #Required
  items {
    #Required
    ## Request Header type : ADD_HTTP_REQUEST_HEADER
    action = each.value.request_header.action
    header = each.value.request_header.header
    value  = each.value.request_header.value
  }
}

resource "oci_load_balancer_certificate" "lb_certificate" {
  #Required
  for_each         = local.mapOf_lb_cert
  certificate_name = each.value.name
  load_balancer_id = oci_load_balancer.createLB[split("_", each.key)[0]].id

  #Optional
  ca_certificate = file(each.value.ca)
  #passphrase = "${var.certificate_passphrase}"
  private_key        = file(each.value.private)
  public_certificate = file(each.value.public)

  lifecycle {
    create_before_destroy = false
  }
}
### End Create certificate and rules set

### Create a path-route-set depending on the number of route for a LB (HTTP listener)
resource "oci_load_balancer_path_route_set" "lb_prs_5paths" {
  for_each = { for key, value in local.mapOf_lb_prs : key => value if length(value) == 5 }
  #Required
  load_balancer_id = oci_load_balancer.createLB[split("_", each.key)[0]].id
  name             = format("lb-prs_%s", split("_", each.key)[1])

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[0])[0])[0])
    path             = values(each.value[0])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[1])[0])[0])
    path             = values(each.value[1])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[2])[0])[0])
    path             = values(each.value[2])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[3])[0])[0])
    path             = values(each.value[3])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[4])[0])[0])
    path             = values(each.value[4])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }  
}

resource "oci_load_balancer_path_route_set" "lb_prs_4paths" {
  for_each = { for key, value in local.mapOf_lb_prs : key => value if length(value) == 4 }
  #Required
  load_balancer_id = oci_load_balancer.createLB[split("_", each.key)[0]].id
  name             = format("lb-prs_%s", split("_", each.key)[1])

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[0])[0])[0])
    path             = values(each.value[0])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[1])[0])[0])
    path             = values(each.value[1])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[2])[0])[0])
    path             = values(each.value[2])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[3])[0])[0])
    path             = values(each.value[3])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }
}

resource "oci_load_balancer_path_route_set" "lb_prs_3paths" {
  for_each = { for key, value in local.mapOf_lb_prs : key => value if length(value) == 3 }
  #Required
  load_balancer_id = oci_load_balancer.createLB[split("_", each.key)[0]].id
  name             = format("lb-prs_%s", split("_", each.key)[1])

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[0])[0])[0])
    path             = values(each.value[0])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[1])[0])[0])
    path             = values(each.value[1])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[2])[0])[0])
    path             = values(each.value[2])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }
}

resource "oci_load_balancer_path_route_set" "lb_prs_2paths" {
  for_each = { for key, value in local.mapOf_lb_prs : key => value if length(value) == 2 }
  #Required
  load_balancer_id = oci_load_balancer.createLB[split("_", each.key)[0]].id
  name             = format("lb-prs_%s", split("_", each.key)[1])

  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[0])[0])[0])
    path             = values(each.value[0])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }
  path_routes {
    #Required
    backend_set_name = format("%s_%s", split("_", each.key)[0], split("_", keys(each.value[1])[0])[0])
    path             = values(each.value[1])[0]
    path_match_type {
      #Required
      match_type = var.path_route_set_path_routes_path_match_type_match_type
    }
  }
}
### END Create a path-route-set depending on the number of route for a LB (HTTP listener)

### Create HTTP listener for previous path route sets
resource "oci_load_balancer_listener" "lblsnr-http" {
  for_each = local.mapOf_lb_lstn_HTTP
  #Required
  default_backend_set_name = format("%s_%s", split("_", each.key)[0], each.value.bs_default)
  load_balancer_id         = oci_load_balancer.createLB[split("_", each.key)[0]].id
  name                     = each.key
  port                     = each.value.ltn_port
  protocol                 = each.value.proto

  #Optional
  connection_configuration {
    #Required
    idle_timeout_in_seconds = var.listener_connection_configuration_idle_timeout_in_seconds
  }
  hostname_names = [each.value.vhostname]
  #path_route_set_name = oci_load_balancer_path_route_set.lb_prs_3paths[format("%s_%s", split("_",each.key)[0], each.value.prs_name)].name
  path_route_set_name = format("lb-prs_%s", each.value.prs_name)
  #rule_set_names      = [oci_load_balancer_rule_set.oid_lb_rs[format("%s_%s", split("_",each.key)[0], each.value.rs_name)]
  #rule_set_names = [format("lb-rs_%s", each.value.rs_name)]
  rule_set_names = [each.value.rs_name]
  ssl_configuration {
    #Required
    #certificate_name = "${oci_load_balancer_certificate.cert.name}"
    certificate_name = var.lb_info[split("_", each.key)[0]].certificates[each.value.cert].name

    #Optional
    verify_depth            = var.listener_ssl_configuration_verify_depth
    verify_peer_certificate = var.listener_ssl_configuration_verify_peer_certificate
  }
}
### Create HTTP listener for previous path route sets