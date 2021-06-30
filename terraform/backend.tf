terraform {
  backend "s3" {
    bucket = "sample-first-docker-tfstate"
    key = "terraform.tfstate"
    region = "ap-northeast-1"
  }
}
