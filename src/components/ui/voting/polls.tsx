import { PublicKey } from '@solana/web3.js'
import Poll from './poll'

const Polls = ({
  polls,
  isPollLoading,
  publicKey,
}: {
  polls: {
    pollId: number
    pollName: string
    pollDescription: string
    pollStart: number
    pollEnd: number
    candidatesCount: number
  }[]
  isPollLoading: boolean
  publicKey: PublicKey
}) => {
  const handleClick = (poolId: number) => {
    console.log(`voting for ${poolId}`)
  }

  return (
    <div className="flex flex-row gap-4 flex-wrap">
      {isPollLoading ? (
        <div className="flex flex-row gap-4 flex-wrap">
          <p>Loading polls...</p>
        </div>
      ) : (
        polls.map((poll) => <Poll key={poll.pollId} poll={poll} handleClick={handleClick} publicKey={publicKey} />)
      )}
    </div>
  )
}

export default Polls
