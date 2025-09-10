package com.example.tictactoe;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {

    private final Map<UUID, Game> store = new ConcurrentHashMap<>();

    private static final int[][] LINES = new int[][] {
            {0,1,2}, {3,4,5}, {6,7,8},
            {0,3,6}, {1,4,7}, {2,5,8},
            {0,4,8}, {2,4,6}
    };

    public Game createGame() {
        Game g = new Game();
        store.put(g.getGameId(), g);
        return g;
    }

    public Game get(UUID id) {
        Game g = store.get(id);
        if (g == null) throw new NoSuchElementException("Game not found");
        return g;
    }

    public Game reset(UUID id) {
        Game g = get(id);
        g.setBoard(new String[9]);
        g.setCurrentPlayer("X");
        g.setWinner(null);
        g.setDraw(false);
        g.setWinningLine(null);
        return g;
    }

    public Game applyMove(UUID id, int row, int col) {
        Game g = get(id);
        if (g.isGameOver()) return g;

        if (row < 0 || row > 2 || col < 0 || col > 2) {
            throw new IllegalArgumentException("Row/Col out of bounds");
        }
        int idx = row * 3 + col;
        String[] b = g.getBoard();

        if (b[idx] != null) {
            throw new IllegalArgumentException("Cell already occupied");
        }

        String mark = g.getCurrentPlayer();
        b[idx] = mark;

        // Check for win/draw
        CheckResult result = checkWinner(b);
        if (result.winner != null) {
            g.setWinner(result.winner);
            g.setWinningLine(result.line);
        } else if (isDraw(b)) {
            g.setDraw(true);
        } else {
            g.setCurrentPlayer(mark.equals("X") ? "O" : "X");
        }
        return g;
    }

    public Game cpuMove(UUID id) {
        Game g = get(id);
        if (g.isGameOver()) return g;

        int move = bestCpuMove(g.getBoard(), g.getCurrentPlayer());
        if (move == -1) return g; // no move

        int row = move / 3;
        int col = move % 3;
        return applyMove(id, row, col);
    }

    private static class CheckResult {
        String winner;
        int[] line;
        CheckResult(String winner, int[] line) { this.winner = winner; this.line = line; }
    }

    private CheckResult checkWinner(String[] board) {
        for (int[] line : LINES) {
            String a = board[line[0]];
            String b = board[line[1]];
            String c = board[line[2]];
            if (a != null && a.equals(b) && a.equals(c)) {
                return new CheckResult(a, line);
            }
        }
        return new CheckResult(null, null);
    }

    private boolean isDraw(String[] board) {
        for (String s : board) if (s == null) return false;
        return true;
    }

    // Heuristic: win -> block -> center -> corner -> side
    private int bestCpuMove(String[] board, String cpu) {
        String human = cpu.equals("X") ? "O" : "X";
        List<Integer> empties = new ArrayList<>();
        for (int i=0;i<9;i++) if (board[i] == null) empties.add(i);
        if (empties.isEmpty()) return -1;

        // 1. Win
        for (int i : empties) {
            String[] clone = board.clone();
            clone[i] = cpu;
            if (checkWinner(clone).winner != null) return i;
        }
        // 2. Block
        for (int i : empties) {
            String[] clone = board.clone();
            clone[i] = human;
            if (checkWinner(clone).winner != null) return i;
        }
        // 3. Center
        if (board[4] == null) return 4;

        // 4. Corners
        int[] corners = {0,2,6,8};
        List<Integer> openCorners = new ArrayList<>();
        for (int c : corners) if (board[c] == null) openCorners.add(c);
        if (!openCorners.isEmpty()) return openCorners.get(new Random().nextInt(openCorners.size()));

        // 5. Sides
        int[] sides = {1,3,5,7};
        List<Integer> openSides = new ArrayList<>();
        for (int s : sides) if (board[s] == null) openSides.add(s);
        if (!openSides.isEmpty()) return openSides.get(new Random().nextInt(openSides.size()));

        return empties.get(0);
    }
}
