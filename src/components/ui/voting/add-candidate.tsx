import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useVotingProgram } from '@/components/voting/voting-data-access'
import { DialogClose, DialogDescription, DialogTrigger } from '@radix-ui/react-dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import * as anchor from '@coral-xyz/anchor'

const AddCandidate = ({ pollId }: { pollId: number }) => {
  const { addCandidate } = useVotingProgram()
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const candidateName = formData.get('name') as string
    const candidateDescription = formData.get('candidate-description') as string

    try {
      await addCandidate.mutateAsync({
        pollId: new anchor.BN(pollId),
        candidateName,
        candidateDescription,
      })
      setOpen(false) // Close dialog on success
    } catch (error) {
      console.error('Failed to add candidate:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Candidate</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>Add a candidate name and description to add a new candidate.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Candidate Name</Label>
              <Input id="name-1" name="name" defaultValue="" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="candidate-description">Candidate Description</Label>
              <Input id="candidate-description" name="candidate-description" defaultValue="" required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={addCandidate.isPending}>
              {addCandidate.isPending ? 'Adding...' : 'Add Candidate'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddCandidate
