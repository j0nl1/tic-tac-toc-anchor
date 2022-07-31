import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {TicTacToe} from "../target/types/tic_tac_toe";

describe("tic-tac-toe", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.TicTacToe as Program<TicTacToe>;

    it('setup game', async () => {
        const gameKeypair = anchor.web3.Keypair.generate()
        const playerOne = (program.provider as anchor.AnchorProvider).wallet
        const playerTwo = anchor.web3.Keypair.generate()
        await program.methods
            .setupGame(playerTwo.publicKey)
            .accounts({
                game: gameKeypair.publicKey,
                playerOne: playerOne.publicKey,
            })
            .signers([gameKeypair])
            .rpc()


        const gameState = await program.account.game.fetch(gameKeypair.publicKey)
        expect(gameState.turn).toEqual(1)
        expect(gameState.players).toEqual([playerOne.publicKey, playerTwo.publicKey])
        expect(gameState.state).toEqual({active: {}})
        expect(gameState.board).toEqual([
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ])
    })
});
