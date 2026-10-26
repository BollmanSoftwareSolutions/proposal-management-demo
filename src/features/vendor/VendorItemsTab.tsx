import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import { useQueryClient } from '@tanstack/react-query'
import { AppLink } from '../../components/common/AppLink'
import { QueryState } from '../../components/common/QueryState'
import {
  useAddAdditionalItemMutation,
  useMyProposalsQuery,
} from '../../graphql/generated/graphql'
import { errorMessage } from '../../lib/errors'

/**
 * Additional items a vendor attaches to their proposal beyond the required
 * artifacts (design-docs/04-ui-ux.md §4.11).
 */
export function VendorItemsTab({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient()
  const proposalsQuery = useMyProposalsQuery()
  const proposal =
    proposalsQuery.data?.myProposals.find((p) => p.projectId === projectId) ??
    null

  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')

  const addItem = useAddAdditionalItemMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useMyProposalsQuery.getKey() })
      setDialogOpen(false)
      setName('')
      setNote('')
    },
  })

  return (
    <QueryState
      isLoading={proposalsQuery.isLoading}
      error={proposalsQuery.error}
      isEmpty={false}
    >
      {!proposal ? (
        <Alert severity="info">
          Sign up for this project on the{' '}
          <AppLink
            to="/projects/$projectId/$tab"
            params={{ projectId, tab: 'setup' }}
          >
            Overview
          </AppLink>{' '}
          tab to add supporting items.
        </Alert>
      ) : (
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography color="text.secondary">
              Optional items you want to include with your proposal, such as
              certifications or references.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ flexShrink: 0 }}
            >
              Add item
            </Button>
          </Box>

          {proposal.additionalItems.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: 'center',
                borderStyle: 'dashed',
                bgcolor: 'background.default',
              }}
            >
              <Typography color="text.secondary">
                No additional items yet.
              </Typography>
            </Paper>
          ) : (
            proposal.additionalItems.map((item) => (
              <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                {item.note && (
                  <Typography variant="body2" color="text.secondary">
                    {item.note}
                  </Typography>
                )}
              </Paper>
            ))
          )}
        </Stack>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add additional item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Note (optional)"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
            {addItem.error != null && (
              <Alert severity="error">
                {errorMessage(addItem.error, 'Could not add the item.')}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!name.trim() || addItem.isPending}
            onClick={() => {
              if (!proposal) return
              addItem.mutate({
                proposalId: proposal.id,
                name: name.trim(),
                note: note.trim() || null,
              })
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </QueryState>
  )
}
