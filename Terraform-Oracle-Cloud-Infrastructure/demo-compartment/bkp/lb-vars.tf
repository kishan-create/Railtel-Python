variable "listener_connection_configuration_idle_timeout_in_seconds" {
  default = "300"
}

variable "listener_ssl_configuration_verify_peer_certificate" {
  default = "false"
}
variable "listener_ssl_configuration_verify_depth" {
  default = "1"
}

variable "path_route_set_path_routes_path_match_type_match_type" {
  default = "PREFIX_MATCH"
}

variable "lb_info" {
  type = map
  default = {
    lb1-ldap = {
      lb_hostname = "lb1-ldap"
      backendSet = {
        oid-odsm     = { backends = ["oidhost1", "oidhost2"], bkend_port = "7002", policy = "ROUND_ROBIN", cert = "cert1" }
        oid-secure   = { backends = ["oidhost1", "oidhost2"], bkend_port = "3131", policy = "IP_HASH", cert = "" }
        oid-unsecure = { backends = ["oidhost1", "oidhost2"], bkend_port = "3060", policy = "IP_HASH", cert = "" }
      }
      prs = {
        oid-full = [{ oid-odsm = { path1 = "/odsm", path2 = "/console", path3 = "/em" } }]
      }
      listeners = {
        lstn_HTTP = {
          oid-odsm = { proto = "HTTP", ltn_port = "443", prs_name = "oid-full", rs_name = "wlproxyssl", cert = "cert1", bs_default = "oid-odsm", vhostname = "ldap.domaine.com" }
        }
        lstn_TCP = {
          oid-unsecure = { proto = "TCP", ltn_port = "3060", bs_default = "oid-unsecure" }
          oid-secure   = { proto = "TCP", ltn_port = "3131", bs_default = "oid-secure" }
        }
      }
      certificates = {
        cert1 = { name = "cert1", ca = "certs/ca.pem", private = "certs/cert_priv.pem", public = "certs/pub_cert.pem" }
      }
      rules = {
        wlproxyssl = { request_header = { action = "ADD_HTTP_REQUEST_HEADER", header = "WL-PROXY-SSL", value = "true" }, response_header = {} }
      }
    }
    lb1-appli = {
      lb_hostname = "lb1-appli"
      backendSet = {
        app1-be = { backends = ["apphost1", "apphost2"], bkend_port = "7102", policy = "ROUND_ROBIN", cert = "cert1" }
        app2-be = { backends = ["apphost1", "apphost2"], bkend_port = "7104", policy = "ROUND_ROBIN", cert = "cert1" }
        app3-be = { backends = ["apphost1", "apphost2"], bkend_port = "9503", policy = "ROUND_ROBIN", cert = "cert1" }
        domain1     = { backends = ["apphost1", "apphost2"], bkend_port = "7002", policy = "ROUND_ROBIN", cert = "cert1" }
        domain2     = { backends = ["apphost1", "apphost2"], bkend_port = "7004", policy = "ROUND_ROBIN", cert = "cert1" }
        domain3     = { backends = ["apphost1", "apphost2"], bkend_port = "9501", policy = "ROUND_ROBIN", cert = "cert1" }
      }
      prs = {
        application-path = [{ app1-be = { path1 = "/myapp", path4 = "/my-app" } }, { app2-be = { path2 = "/app2" } }, { app3-be = { path3 = "/app3", path5 = "/app-" } }]
        wls-domain1    = [{ domain1 = { path1 = "/em", path2 = "/console" } }]
        wls-domain2    = [{ domain2 = { path1 = "/em", path2 = "/console" } }]
        wls-domain3    = [{ domain3 = { path1 = "/em", path2 = "/console" } }]
      }
      listeners = {
        lstn_HTTP = {
          applis-lsn  = { proto = "HTTP", ltn_port = "443", prs_name = "application-path", rs_name = "wlproxyssl", cert = "cert1", bs_default = "app1-be", vhostname = "appli.domaine.com" }
          console-dom1 = { proto = "HTTP", ltn_port = "443", prs_name = "wls-domain1", rs_name = "wlproxyssl", cert = "cert1", bs_default = "domain1", vhostname = "adm1.domaine.com" }
          console-dom2 = { proto = "HTTP", ltn_port = "443", prs_name = "wls-domain2", rs_name = "wlproxyssl", cert = "cert1", bs_default = "domain2", vhostname = "adm2.domaine.com" }
          console-dom3 = { proto = "HTTP", ltn_port = "443", prs_name = "wls-domain3", rs_name = "wlproxyssl", cert = "cert1", bs_default = "domain3", vhostname = "adm3.domaine.com" }
        }
        lstn_TCP = {}
      }
      certificates = {
        cert1 = { name = "cert1", ca = "certs/ca.pem", private = "certs/cert_priv.pem", public = "certs/pub_cert.pem" }
      }
      rules = {
        wlproxyssl = { request_header = { action = "ADD_HTTP_REQUEST_HEADER", header = "WL-PROXY-SSL", value = "true" }, response_header = {} }
      }
    }
  }
}