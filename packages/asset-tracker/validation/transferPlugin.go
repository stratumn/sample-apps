package main

import (
	"bytes"
	"context"
	"errors"

	"github.com/stratumn/go-core/store"
	"github.com/stratumn/go-core/types"
)

// TransferData represents the link's data format.
type TransferData struct {
	Owner string `json:"owner"`
}

// Validate that an ownership transfer contains a valid signature from the
// previous owner.
func Validate(ctx context.Context, r store.SegmentReader, l *types.Link) error {
	if l.Link.Meta.Step == "transfer" {
		return validateTransfer(ctx, r, l)
	}

	return nil
}

func validateTransfer(ctx context.Context, r store.SegmentReader, l *types.Link) error {
	parent, err := r.GetSegment(ctx, l.Link.PrevLinkHash())
	if err != nil {
		return err
	}

	var parentData TransferData
	err = parent.Link.StructurizeData(&parentData)
	if err != nil {
		return err
	}

	publicKeys := map[string][]byte{
		"alice": []byte("-----BEGIN ED25519 PUBLIC KEY-----\nMCwwBwYDK2VwBQADIQBHceWVsJFGlQPtcqVfWeSBYWrmzbuerntZmCyImLB2wA==\n-----END ED25519 PUBLIC KEY-----\n"),
		"bob":   []byte("-----BEGIN ED25519 PUBLIC KEY-----\nMCwwBwYDK2VwBQADIQB4VEmMHTKjGXmNbrESiLp6XydmypyzXF/HO4jT/QT9tg==\n-----END ED25519 PUBLIC KEY-----\n"),
		"carol": []byte("-----BEGIN ED25519 PUBLIC KEY-----\nMCwwBwYDK2VwBQADIQBRiQf5dDgEhKaiU/9cq88snWlY0AafXPreJCUWei1ezg==\n-----END ED25519 PUBLIC KEY-----\n"),
	}

	parentPublicKey, ok := publicKeys[parentData.Owner]
	if !ok {
		return errors.New("unknown previous asset owner")
	}

	signatureFound := false
	for _, s := range l.Link.Signatures {
		if bytes.Equal(parentPublicKey, s.PublicKey) {
			err = s.Validate(l.Link)
			if err != nil {
				return err
			}

			signatureFound = true
			break
		}
	}

	if !signatureFound {
		return errors.New("missing signature from previous owner")
	}

	return nil
}

func main() {}
