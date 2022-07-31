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

    it('player one wins', async () => {
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


        let gameState = await program.account.game.fetch(gameKeypair.publicKey)
        expect(gameState.turn).toEqual(1)
        expect(gameState.players).toEqual([playerOne.publicKey, playerTwo.publicKey])
        expect(gameState.state).toEqual({active: {}})
        expect(gameState.board).toEqual([
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ])


        await play(
            program,
            gameKeypair.publicKey,
            playerOne,
            {row: 0, column: 0},
            2,
            {active: {}},
            [
                [{x: {}}, null, null],
                [null, null, null],
                [null, null, null],
            ]
        )
    })
});

async function play(
    program: Program<TicTacToe>,
    game,
    player,
    tile,
    expectedTurn,
    expectedGameState,
    expectedBoard
) {
    await program.methods
        .play(tile)
        .accounts({
            player: player.publicKey,
            game,
        })
        .signers(player instanceof (anchor.Wallet as any) ? [] : [player])
        .rpc()


    const gameState = await program.account.game.fetch(game)
    expect(gameState.turn).toEqual(expectedTurn)
    expect(gameState.state).toEqual(expectedGameState)
    expect(gameState.board).toEqual(expectedBoard)
}