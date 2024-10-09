#
variable "system_availability_domain" {
  default = {
    us-ashburn-1 = "NdNQ:US-ASHBURN-AD-1"
    us-ashburn-2 = "NdNQ:US-ASHBURN-AD-2"
    us-ashburn-3 = "NdNQ:US-ASHBURN-AD-3"
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

