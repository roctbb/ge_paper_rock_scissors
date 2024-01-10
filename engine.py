import ge_sdk as sdk
import time

def game():
    engine = sdk.GameEngineClient()

    engine.start()

    left_wins = 0
    right_wins = 0
    rounds = 0

    players = [engine.teams[0].players[0], engine.teams[1].players[0]]

    left_history = []
    right_history = []

    while True:
        rounds += 1

        # запускаем скрипты игроков
        left_choice = sdk.timeout_run(0.4, players[0].script, "make_choice", [right_history])
        right_choice = sdk.timeout_run(0.4, players[1].script, "make_choice", [left_history])

        # проверяем корректность ответов
        if left_choice not in ['paper', 'rock', 'scissors']:
            left_choice = None
        if right_choice not in ['paper', 'rock', 'scissors']:
            right_choice = None

        # если обе программы сломались - прерываем игру без победителя
        if not left_choice and not right_choice:
            break

        # если глючит кто-то один, засчитываем  победу оппоненту
        if not left_choice and right_choice:
            right_wins += 1
        if not right_choice and left_choice:
            left_wins += 1

        # определяем победителя раунда
        if left_choice != right_choice:
            if left_choice == "rock":
                if right_choice == "scissors":
                    left_wins += 1
                else:
                    right_wins += 1
            elif left_choice == "paper":
                if right_choice == "rock":
                    left_wins += 1
                else:
                    right_wins += 1
            elif left_choice == "scissors":
                if right_choice == "paper":
                    left_wins += 1
                else:
                    right_wins += 1

        frame = {
            "players": {
                "left": players[0].name,
                "right": players[1].name
            },
            "wins": {
                "left": left_wins,
                "right": right_wins,
            },
            "choices": {
                "left": left_choice,
                "right": right_choice
            },
            "rounds": rounds,
        }

        if left_wins == right_wins + 3:
            engine.set_winner(engine.teams[0])
            frame["winner"] = "left"

        if left_wins + 3 == right_wins:
            engine.set_winner(engine.teams[1])
            frame["winner"] = "right"

        engine.send_frame(frame)

        if frame.get("winner"):
            break

        time.sleep(0.7)

    engine.end()


if __name__ == "__main__":
    game()
