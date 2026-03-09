// embeds assets for serving
package handler

import (
	"embed"
)

//go:embed dist
var CrossworderEFS embed.FS
