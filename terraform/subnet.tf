resource "aws_subnet" "sample-subnet-1a" {
  availability_zone = "ap-northeast-1a"
  cidr_block = "172.31.32.0/20"
  map_public_ip_on_launch = true
  vpc_id = aws_vpc.sample-vpc.id
  tags = {
    "Name" = "sample-subnet-1a"
  }
}

resource "aws_subnet" "sample-subnet-1c" {
  availability_zone = "ap-northeast-1c"
  cidr_block = "172.31.0.0/20"
  map_public_ip_on_launch = true
  vpc_id = aws_vpc.sample-vpc.id
  tags = {
    "Name" = "sample-subnet-1c"
  }
}

resource "aws_subnet" "sample-subnet-1d" {
  availability_zone = "ap-northeast-1d"
  cidr_block = "172.31.16.0/20"
  map_public_ip_on_launch = true
  vpc_id = aws_vpc.sample-vpc.id
  tags = {
    "Name" = "sample-subnet-1d"
  }
}
