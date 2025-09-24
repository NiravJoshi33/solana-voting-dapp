'use client'

import { getVotingProgram, getVotingProgramId, getPolls, canUserAddCandidate, closePoll } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { useCluster } from '../cluster/cluster-data-access'
import { useTransactionToast } from '../use-transaction-toast'
import { useAnchorProvider } from '../solana/solana-provider'
import { useMemo } from 'react'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as anchor from '@coral-xyz/anchor'

export const useVotingProgram = () => {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()
  const programId = useMemo(() => getVotingProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getVotingProgram(provider, programId), [provider, programId])

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initializePollCounter = useMutation({
    mutationKey: ['voting', 'initialize-poll-counter', { cluster }],
    mutationFn: () => program.methods.initializePollCounter().rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
    },
    onError: () => {
      toast.error('Poll counter already exists')
    },
  })

  const initializePoll = useMutation({
    mutationKey: ['voting', 'initialize-poll', { cluster }],
    mutationFn: ({
      pollName,
      pollDescription,
      pollStart,
      pollEnd,
    }: {
      pollName: string
      pollDescription: string
      pollStart: number
      pollEnd: number
    }) =>
      program.methods.initializePoll(pollName, pollDescription, new anchor.BN(pollStart), new anchor.BN(pollEnd)).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      // Refresh the polls list
      queryClient.invalidateQueries({ queryKey: ['voting', 'get-polls', { cluster }] })
    },
    onError: () => {
      toast.error('Failed to initialize poll')
    },
  })

  const getPollsQuery = useQuery({
    queryKey: ['voting', 'get-polls', { cluster }],
    queryFn: () => getPolls(program),
  })

  const addCandidate = useMutation({
    mutationKey: ['voting', 'add-candidate', { cluster }],
    mutationFn: ({
      pollId,
      candidateName,
      candidateDescription,
    }: {
      pollId: anchor.BN
      candidateName: string
      candidateDescription: string
    }) => program.methods.initializeCandidate(pollId, candidateName, candidateDescription).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      // Refresh the polls list
      queryClient.invalidateQueries({ queryKey: ['voting', 'get-polls', { cluster }] })
    },
    onError: () => {
      toast.error('Failed to add candidate')
    },
  })

  const useCanUserAddCandidateQuery = (pollId: number, publicKey: PublicKey) =>
    useQuery({
      queryKey: ['voting', 'can-user-add-candidate', { cluster, pollId, publicKey: publicKey.toBase58() }],
      queryFn: () => canUserAddCandidate(program, pollId, publicKey),
    })

  const closePollQuery = useMutation({
    mutationKey: ['voting', 'close-poll', { cluster }],
    mutationFn: ({ pollId }: { pollId: number }) => closePoll(program, pollId),
    onSuccess: (signature) => {
      transactionToast(signature)
    },
    onError: (error) => {
      toast.error(`Failed to close poll: ${error}`)
    },
  })

  return {
    program,
    programId,
    getProgramAccount,
    initializePollCounter,
    initializePoll,
    getPollsQuery,
    addCandidate,
    useCanUserAddCandidateQuery,
    closePollQuery,
  }
}
