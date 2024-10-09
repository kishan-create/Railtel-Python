# 
variable "system_availability_domain" {
  default = {
    eu-frankfurt-1 = "LKnU:EU-FRANKFURT-1-AD-1"
    eu-frankfurt-2 = "LKnU:EU-FRANKFURT-1-AD-2"
    eu-frankfurt-3 = "LKnU:EU-FRANKFURT-1-AD-3"
  }
}
variable "backup_policy" {
  description = "Choose between default backup policies : Gold, Silver or Bronze."
  type        = string
  default     = "gold"
}

variable "boot_volume_size_in_gbs" {
  description = "Boot Volume size in GBs"
  type        = number
  default     = "60"
}

variable "preserve_boot_volume" {
  type    = bool
  default = false
}

variable "opc_ssh_private_key" {
  description = "OPC ssh private KEY to be used for remote exec"
  default     = "opc_ssh_private_key"
}

variable "opc_ssh_public_key" {
  description = "OPC Public SSH keys path to be included in the ~/.ssh/authorized_keys file for the default user on the instance."
  default     = "opc_ssh_public_key" 
}
