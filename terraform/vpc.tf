resource "aws_vpc" "sample-vpc" {
  cidr_block = "172.31.0.0/16"
  enable_dns_hostnames = true
  tags = {
    "Name" = "sample-vpc"
  }
}
