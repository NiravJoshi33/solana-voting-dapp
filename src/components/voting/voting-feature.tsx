'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useVotingProgram } from './voting-data-access'
import { WalletButton } from '../solana/solana-provider'
import { AppHero } from '../app-hero'
import { ExplorerLink } from '../cluster/cluster-ui'
import { ellipsify } from '@/lib/utils'
import PollCreate from '../ui/voting/poll-create'
import Polls from '../ui/voting/polls'

const VotingFeature = () => {
  const { publicKey } = useWallet()
  const { programId: votingProgramId } = useVotingProgram()
  const { getPollsQuery } = useVotingProgram()

  return publicKey ? (
    <div>
      <AppHero title="Voting" subtitle={'Run the program by clicking the "Run program" button.'}>
        <p className="mb-6">
          <ExplorerLink path={`account/${votingProgramId}`} label={ellipsify(votingProgramId.toString())} />
        </p>
        <PollCreate />
      </AppHero>
      <Polls polls={getPollsQuery.data ?? []} isPollLoading={getPollsQuery.isLoading} publicKey={publicKey} />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton className="btn btn-primary" />
        </div>
      </div>
    </div>
  )
}

export default VotingFeature
