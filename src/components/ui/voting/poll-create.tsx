import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useVotingProgram } from '@/components/voting/voting-data-access'
import { DialogClose, DialogDescription, DialogTrigger } from '@radix-ui/react-dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

const PollCreate = () => {
  const { initializePoll } = useVotingProgram()
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const pollName = formData.get('name') as string
    const pollDescription = formData.get('poll-description') as string
    const pollStart = formData.get('start-timestamp') as string
    const pollEnd = formData.get('end-timestamp') as string

    try {
      await initializePoll.mutateAsync({
        pollName,
        pollDescription,
        pollStart: new Date(pollStart).getTime(),
        pollEnd: new Date(pollEnd).getTime(),
      })
      setOpen(false) // Close dialog on success
    } catch (error) {
      console.error('Failed to create poll:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Poll</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Poll</DialogTitle>
            <DialogDescription>Add a poll name and description to create a new poll.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Poll Name</Label>
              <Input id="name-1" name="name" defaultValue="" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="poll-description">Poll Description</Label>
              <Input id="poll-description" name="poll-description" defaultValue="" required />
            </div>

            {/* start timestamp */}
            <div className="grid gap-3">
              <Label htmlFor="start-timestamp">Start Timestamp</Label>
              <Input
                id="start-timestamp"
                type="datetime-local"
                name="start-timestamp"
                defaultValue={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            {/* end timestamp */}
            <div className="grid gap-3">
              <Label htmlFor="end-timestamp">End Timestamp</Label>
              <Input
                id="end-timestamp"
                type="datetime-local"
                name="end-timestamp"
                defaultValue={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={initializePoll.isPending}>
              {initializePoll.isPending ? 'Creating...' : 'Create Poll'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PollCreate
