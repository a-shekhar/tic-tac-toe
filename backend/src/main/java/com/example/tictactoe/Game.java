package com.example.tictactoe;

import java.util.Arrays;
import java.util.UUID;

public class Game {
    private UUID gameId;
    // Board of length 9, values: "X", "O", or null
    private String[] board;
    private String currentPlayer; // "X" or "O"
    private String winner;        // null, "X", "O"
    private boolean draw;
    private int[] winningLine;    // e.g., [0,4,8] or null

    public Game() {
        this.gameId = UUID.randomUUID();
        this.board = new String[9];
        this.currentPlayer = "X";
        this.winner = null;
        this.draw = false;
        this.winningLine = null;
    }

    public UUID getGameId() { return gameId; }
    public String[] getBoard() { return board; }
    public String getCurrentPlayer() { return currentPlayer; }
    public String getWinner() { return winner; }
    public boolean isDraw() { return draw; }
    public int[] getWinningLine() { return winningLine; }

    public void setBoard(String[] board) { this.board = board; }
    public void setCurrentPlayer(String currentPlayer) { this.currentPlayer = currentPlayer; }
    public void setWinner(String winner) { this.winner = winner; }
    public void setDraw(boolean draw) { this.draw = draw; }
    public void setWinningLine(int[] line) { this.winningLine = line; }

    public boolean isGameOver() {
        return winner != null || draw;
    }

    @Override
    public String toString() {
        return "Game{" +
            "id=" + gameId +
            ", board=" + Arrays.toString(board) +
            ", current=" + currentPlayer +
            ", winner=" + winner +
            ", draw=" + draw +
            '}';
    }
}
