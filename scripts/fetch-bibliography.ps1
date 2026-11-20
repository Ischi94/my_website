$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$source = Get-Content -Raw -LiteralPath (Join-Path $root 'research-sources/orcid-works.json') | ConvertFrom-Json
$dois = @($source.group.'work-summary' | Where-Object { $_.type -eq 'journal-article' } | ForEach-Object { ($_.'external-ids'.'external-id' | Where-Object { $_.'external-id-type' -eq 'doi' }).'external-id-value' }) + @('10.1016/j.cub.2025.12.017')
$dir = Join-Path $root 'research-sources/crossref'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
foreach ($doi in ($dois | Sort-Object -Unique)) {
  $file = Join-Path $dir (($doi -replace '[^a-zA-Z0-9.-]', '_') + '.json')
  if (!(Test-Path -LiteralPath $file)) {
    $result = Invoke-RestMethod -Uri ('https://api.crossref.org/works/' + [uri]::EscapeDataString($doi)) -TimeoutSec 40
    $result.message | ConvertTo-Json -Depth 60 | Set-Content -Encoding utf8 -LiteralPath $file
  }
  $m = Get-Content -Raw -LiteralPath $file | ConvertFrom-Json
  [PSCustomObject]@{doi=$doi; title=$m.title[0]; type=$m.type; issued=$m.issued.'date-parts'; print=$m.'published-print'.'date-parts'; online=$m.'published-online'.'date-parts'; authors=$m.author.Count}
}
