import { useVotingProgram } from '@/components/voting/voting-data-access'
import { Button } from '../button'
import { PublicKey } from '@solana/web3.js'
import AddCandidate from './add-candidate'

const Poll = ({
  poll,
  handleClick,
  publicKey,
}: {
  poll: {
    pollId: number
    pollName: string
    pollDescription: string
    pollStart: number
    pollEnd: number
    candidatesCount: number
  }
  handleClick: (pollId: number) => void
  publicKey: PublicKey
}) => {
  const { useCanUserAddCandidateQuery, closePollQuery } = useVotingProgram()
  const canUserAddCandidate = useCanUserAddCandidateQuery(poll.pollId, publicKey)

  return (
    <div key={poll.pollId} className="border border-gray-200 rounded-md p-4 min-w-[300px]">
      <h3 className="text-lg font-bold">{poll.pollName}</h3>
      <p className="text-sm text-gray-500">{poll.pollDescription}</p>
      <p className="text-sm text-gray-500">{new Date(poll.pollStart).toLocaleString()}</p>
      <p className="text-sm text-gray-500">{new Date(poll.pollEnd).toLocaleString()}</p>
      <p className="text-sm text-gray-500">{poll.candidatesCount} candidates</p>

      <div className="flex flex-col w-full gap-4">
        <Button className="mt-4" onClick={() => handleClick(poll.pollId)} disabled={poll.candidatesCount === 0}>
          Vote
        </Button>
        {canUserAddCandidate && <AddCandidate pollId={poll.pollId} />}
        <Button className="mt-4" onClick={() => closePollQuery.mutate({ pollId: poll.pollId })}>
          {closePollQuery.isPending ? 'Closing...' : 'Close Poll'}
        </Button>
      </div>
    </div>
  )
}

export default Poll
