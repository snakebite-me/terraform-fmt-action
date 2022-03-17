# Terraform FMT

Check your Terraform code for compatibility with its official standards. 

## Usage
```yaml
name: Terraform FMT
on:
  workflow_dispatch:

jobs:
  fmt:
    name: Terraform FMT
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@master
        
      - name: Fmt
        uses: snakebite-me/terraform-fmt-action@main
        with:
          recursive: false
          paths: "dir_a;dir_b;file_c.tf"

```

## Inputs
`paths` - Semicolon-separated list of files and directories to check. Defaults to repository root.

`recursive` - Whether to check directories recursively. Defaults to true. Ignored if a path leads to a file instead of a directory.

## Outputs
`misformatted` - List of strings containing semicolon-separated paths of misformatted files. Returns a separate string for each path provided.