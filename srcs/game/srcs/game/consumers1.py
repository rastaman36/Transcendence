from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
# from django.contrib.auth.models import User
# from game.models import Game
import math
import asyncio
import json
import random
import uuid
import time 


DELTA_SPEED = 0.2
START_SPEED = 1.5
user_queue = set()
class PongConsumer(AsyncWebsocketConsumer):
	game_state = {}
	async def initialize_game_state(self, room_name):
		angle = 30
		direction = random.choice([-1, 1])
		self.game_state[room_name] = {
			"ball" :{
				'position': {'x': 0, 'y': 0, 'z': 0},
				# 'velocity': {'x': 2, 'y': 0, 'z': 1},
				'velocity': {'x': direction * 0.2, 'y': 0, 'z': direction * 0.2 * math.sin(angle)},
				'speed': START_SPEED,
				'radius': 0.5,
			},
			"players":{
				"paddle1": {
					'connected': None,
					'id': None,
					'channel_name': None,
					'position': {'x': 0, 'y': 0, 'z': 18},
					'p1_dx': 0,
					'p2' : 0,
					'p2_dx': 0,
					'score': 0,
					'oscore': 0,
				},
				"paddle2": {
					'connected': None,
					'id': None,
					'channel_name': None,
					'position': {'x': 0, 'y': 0, 'z': 18},
					'p1_dx' : 0,
					'p2_dx': 0,
					'p2' : 0,
					'score': 0,
					'oscore': 0,
				}
			},
			'maxScore': 7,
			'over': False,  
			'started': False,
		}

	async def setPlayers(self, room_name):
		if self.game_state[room_name]["players"]["paddle1"]["id"] == None:
			self.game_state[room_name]["players"]["paddle1"]["id"] = self.player_id
			self.game_state[room_name]["players"]["paddle1"]["channel_name"] = self.channel_name
			self.game_state[room_name]["players"]["paddle1"]["connected"] = True
		elif self.game_state[room_name]["players"]["paddle2"]["id"] == None:
			self.game_state[room_name]["players"]["paddle2"]["id"] = self.player_id
			self.game_state[room_name]["players"]["paddle2"]["channel_name"] = self.channel_name
			self.game_state[room_name]["players"]["paddle2"]["connected"] = True

		else :
			print("we have a full room")

	async def connect(self):
		self.boundaries = {'x': 18, 'y': 22}
		self.paddle_width = 6
		self.ball_redius = 0.5
		self.scope["user_id"] = str(uuid.uuid4())
		self.player_id = self.scope["user_id"]
		await self.accept()
		user_queue.add(self)
		await self.send(text_data=json.dumps({
			'action': 'waiting',
			'player_id': self.player_id,
			'message': 'Waiting for opponent...'
		}))
		if len(user_queue) >= 2:
			await self.create_room()
		# self.scope["user"] = database_sync_to_async(User.objects.get_or_create)(id=self.scope["user_id"])
			

	async def create_room(self):
		# Get two players from the queue
		player1 = self
		user_queue.remove(player1)
		player2 = user_queue.pop()

		# Create unique room name from player IDs
		self.room_name = f"room_{player1.player_id}_{player2.player_id}"
		player2.room_name = self.room_name

		# Initialize game state
		await self.initialize_game_state(self.room_name)

		# Set up players
		self.game_state[self.room_name]["players"]["paddle1"]["id"] = player1.player_id
		self.game_state[self.room_name]["players"]["paddle1"]["channel_name"] = player1.channel_name
		self.game_state[self.room_name]["players"]["paddle1"]["connected"] = True

		self.game_state[self.room_name]["players"]["paddle2"]["id"] = player2.player_id
		self.game_state[self.room_name]["players"]["paddle2"]["channel_name"] = player2.channel_name
		self.game_state[self.room_name]["players"]["paddle2"]["connected"] = True

		# Add both players to the room group
		room_group = f'pong_{self.room_name}'
		await self.channel_layer.group_add(room_group, player1.channel_name)
		await self.channel_layer.group_add(room_group, player2.channel_name)

		# Notify both players
		# for player in [player1, player2]:
		await player1.send(text_data=json.dumps({
			'action': 'new_connection',
			'player_id': player1.player_id,
			'player2_id': player2.player_id,
			'room_name': self.room_name
		}))

		await player2.send(text_data=json.dumps({
			'action': 'new_connection',
			'player_id': player2.player_id,
			'player2_id': player1.player_id,
			'room_name': self.room_name
		}))

		# Start the game
		await self.channel_layer.group_send(
			room_group,
			{
				'type': 'start',
				'action': 'start',
				'player1_id': player1.player_id,
				'player2_id': player2.player_id
			}
		)
		time.sleep(4)
		asyncio.create_task(self.game_loop())
	
	async def ballCollision(self, ball, player):
		PADDLE_HITBOX_HEIGHT = 6  # Adjust based on your paddle size
		BALL_RADIUS = ball['radius']
		angle = random.uniform(-math.pi, math.pi)
		# direction = random.choice([-1, 1])
		if (ball['position']['x'] + BALL_RADIUS > self.boundaries['x'] or 
			ball['position']['x'] - BALL_RADIUS < -self.boundaries['x']):
			ball['velocity']['x'] *= -1
			# ball['velocity']['z'] *= -1
		
		if (ball['position']['z'] + BALL_RADIUS > 18 and 
			ball['position']['x'] > player["position"]["x"] - self.paddle_width/2 and 
			ball['position']['x'] < player["position"]["x"] + self.paddle_width/2):
			ball['velocity']['z'] *= -1
			ball['position']['z'] = 18 - BALL_RADIUS
			ball['velocity']['x'] +=  random.uniform(-0.1, 0.1)

		
		if (ball['position']['z'] - BALL_RADIUS < -18 and 
			ball['position']['x'] > player["p2"] - self.paddle_width/2 and 
			ball['position']['x'] < player["p2"] + self.paddle_width/2):
			ball['velocity']['z'] *= -1
			ball['position']['z'] = -18 + BALL_RADIUS
			ball['velocity']['x'] += random.uniform(-0.1, 0.1)

		#  Score
		if ball['position']['z'] + BALL_RADIUS > self.boundaries['y'] - 2:
			player["oscore"] += 1
			return await self.reset_ball()
		elif ball['position']['z'] - BALL_RADIUS < -self.boundaries['y'] + 2:
			player["score"] += 1
			return await self.reset_ball()
		return ball

	async def reset_ball(self):
		angle = 30  # Narrower angle for better gameplay
		direction_x = random.choice([-1, 1])
		direction_z = random.choice([-1, 1])
		# angle = random.uniform(-math.pi / 2 , math.pi / 2)
		# direction = random.choice([-1, 1])
		return {
			'position': {'x': 0, 'y': 0, 'z': 0},
			'velocity': {
			'x': direction_x * 0.2 * math.cos(angle),  # Use cosine for X
			'z': direction_z * 0.2 * math.sin(angle),  # Use sine for Z
		},
		'speed': START_SPEED,
		'radius': 0.5,
			# 'position': {'x': 0, 'y': 0, 'z': 0},
			# 'velocity': {'x': 0.2, 'y': 0, 'z': 0.2 * math.sin(angle)},
			# 'speed': 5.5,
			# 'radius': 0.5,
		}

		
	async def game_loop(self):
		while True:
			if not self.game_state[self.room_name]["players"]["paddle1"]["connected"]:
				self.game_state[self.room_name]["players"]["paddle1"]["score"] = 0
				self.game_state[self.room_name]["players"]["paddle1"]["oscore"] = 3
				break
			elif not self.game_state[self.room_name]["players"]["paddle2"]["connected"]:
				self.game_state[self.room_name]["players"]["paddle1"]["score"] = 3
				self.game_state[self.room_name]["players"]["paddle1"]["oscore"] = 0
				break
			self.game_state[self.room_name]["ball"]["position"]["x"] += self.game_state[self.room_name]["ball"]["velocity"]["x"] * self.game_state[self.room_name]["ball"]["speed"]
			self.game_state[self.room_name]["ball"]["position"]["z"] += self.game_state[self.room_name]["ball"]["velocity"]["z"] * self.game_state[self.room_name]["ball"]["speed"]
			self.game_state[self.room_name]["players"]["paddle1"]["position"]["x"] += self.game_state[self.room_name]["players"]["paddle1"]["p1_dx"]
			self.game_state[self.room_name]["players"]["paddle1"]["p2"] += self.game_state[self.room_name]["players"]["paddle1"]["p2_dx"]
			self.game_state[self.room_name]["players"]["paddle2"]["position"]["x"] += self.game_state[self.room_name]["players"]["paddle2"]["p1_dx"]
			self.game_state[self.room_name]["players"]["paddle2"]["p2"] += self.game_state[self.room_name]["players"]["paddle2"]["p2_dx"]
			self.game_state[self.room_name]["ball"] = await self.ballCollision(self.game_state[self.room_name]["ball"], self.game_state[self.room_name]["players"]["paddle1"])
			# self.game_state[self.room_name]["players"]["paddle1"] = await self.paddleCollision()/
			await self.send_game_state(self.game_state[self.room_name])
			await asyncio.sleep(1/60)
			if self.game_state[self.room_name]["players"]["paddle1"]["score"] == 5 or self.game_state[self.room_name]["players"]["paddle2"]["score"] == 5:
				break
		# game = await database_sync_to_async(Game.objects.get)(room_name=self.room_name)
		# await database_sync_to_async(game.set_score)(
		# 	self.player_id,
		# 	self.game_state[self.room_name]["players"]["paddle1"]["score"],
		# 	self.game_state[self.room_name]["players"]["paddle1"]["oscore"])
		# await database_sync_to_async(game.set_winner)()``
		# await self.channel_layer.group_send(
		# 	self.room_group_name,
		# 	{
		# 		'type': 'state',
		# 		'action': 'end'
		# 	}
		# )


	async def send_game_state(self, game_state):
		await self.channel_layer.send(
			game_state['players']['paddle1']['channel_name'],
			{
				'type': 'game',
				'game_state': game_state
			}
		)

		game_state_player2 = game_state.copy()
		mirrored_ball = game_state['ball'].copy()
		# mirrored_ball['position']['x'] = -game_state['ball']['position']['x']
		# mirrored_ball['position']['z'] = -game_state['ball']['position']['z']
		# # mirrored_ball['position']['z'] = self.boundaries['x'] - game_state["ball"]["position"]["z"]
		# mirrored_ball['position']['z'] *= -1
		# # mirrored_paddle = game_state['players'].copy()
		# # mirrored_paddle["paddle2"]["position"]["x"] *= -1
		# # mirrored_paddle["paddle2"]["position"]["z"] *= -1
		# # game_state_player2["players"]["paddle2"]["p2"] *= -1
		# game_state_player2['ball'] = mirrored_ball.copy()
		await self.channel_layer.send(
			game_state['players']['paddle2']['channel_name'],
			{
				'type': 'game',
				'game_state': game_state_player2 
			}
		)
		
	async def disconnect(self, close_code):
		# if self.player_id == self.game_state[self.room_name]["players"]["paddle1"]["id"]:
		# 	self.game_state[self.room_name]["players"]["paddle1"]["connected"] = False
		# elif self.player_id == self.game_state[self.room_name]["players"]["paddle2"]["id"]:
		# 	self.game_state[self.room_name]["players"]["paddle2"]["connected"] = False
		# await self.channel_layer.group_discard(
		# 	self.room_group_name,
		# 	self.channel_name
		# )
		if self in user_queue:
			user_queue.remove(self)

		# Handle game disconnection
		if hasattr(self, 'room_name') and self.room_name in self.game_state:
			if self.player_id == self.game_state[self.room_name]["players"]["paddle1"]["id"]:
				self.game_state[self.room_name]["players"]["paddle1"]["connected"] = False
			elif self.player_id == self.game_state[self.room_name]["players"]["paddle2"]["id"]:
				self.game_state[self.room_name]["players"]["paddle2"]["connected"] = False

			await self.channel_layer.group_discard(
				f'pong_{self.room_name}',
				self.channel_name
			)

	# receive message from websocket
	async def receive(self, text_data):
		data = json.loads(text_data)
		message_type = data['type']
		roomname = data.get("room_name")
		if message_type == 'game_update':
			#update game state for all players in the room 
			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'game_state_update',
					'data': data['data']
				}
			)
		if message_type == 'paddle_movement':
			player_id = data['player_id']
			paddle_dy = data['paddle_dy']

			if player_id == self.game_state[roomname]["players"]["paddle1"]["id"]:
				self.game_state[roomname]["players"]["paddle1"]["p1_dx"] = paddle_dy
				self.game_state[roomname]["players"]["paddle2"]["p2_dx"] = paddle_dy
			elif player_id == self.game_state[roomname]["players"]["paddle2"]["id"]:
				self.game_state[roomname]["players"]["paddle2"]["p1_dx"] = -paddle_dy
				self.game_state[roomname]["players"]["paddle1"]["p2_dx"] = -paddle_dy

	async def game(self, event):
		await self.send(text_data=json.dumps({
		'action': 'game_state',
		'game_state': event['game_state']
	}))

	# async def state(self, event):
	# # Handler for 'game_stat e_update' type messages
	# 	await self.send(text_data=json.dumps({
	# 		'type': 'game_state',
	# 		'data': event['data']
	# }))

	async def start(self, event):
	# Handler for 'start' type messages
		await self.send(text_data=json.dumps({
			'type': 'game_start',
			'player1_id': event['player1_id'],
			'player2_id': event['player2_id']
	}))

class localGameConsumer(AsyncWebsocketConsumer):
	async def init_game(self):
		angle = 30
		direction = random.choice([-1, 1])
		self.game_state = {
			"ball" :{
				'position': {'x': 0, 'y': 0, 'z': 0},
				'velocity': {'x': direction * 0.2, 'y': 0, 'z': direction * 0.2 * math.sin(angle)},
				'speed': START_SPEED,
				'radius': 0.5,
			},
			"players":{
				"paddle1": {
					'position': {'x': 0, 'y': 0, 'z': 26},
					'dx': 0,
					'score': 0,
				},
				"paddle2": {
					'position': {'x': 0, 'y': 0, 'z': -26},
					'dx': 0,
					'score': 0,
				}
			},
			'maxScore': 5,
			'over': False,
			'started': False,
		}


	async def connect(self):
		self.boundaries = {"x": 18, "y": 27}
		self.paddle_width = 6
		self.ball_radius = 0.5
		await self.accept()
		await self.init_game()
		await self.send(
			text_data=json.dumps(
				{"action": "game_ready", "game_state": self.game_state}
			)
		)
		asyncio.create_task(self.game_loop())
	
	async def ball_collision(self):
		ball = self.game_state["ball"]
		paddle1 = self.game_state["players"]["paddle1"]
		paddle2 = self.game_state["players"]["paddle2"]

		# Ball-wall collision (x-axis boundaries)
		if (ball["position"]["x"] + ball["radius"] > self.boundaries["x"]
				or ball["position"]["x"] - ball["radius"] < -self.boundaries["x"]):
			ball["velocity"]["x"] *= -1

		# Paddle 1 collision
		if (ball["position"]["z"] + ball["radius"] > paddle1["position"]["z"] - 1
				and paddle1["position"]["x"] - self.paddle_width / 2
				<= ball["position"]["x"] <= paddle1["position"]["x"] + self.paddle_width / 2):
			ball["velocity"]["z"] *= -1
			ball["speed"] += DELTA_SPEED;
 
			# Adjust x velocity based on impact point
			impact_offset = (ball["position"]["x"] - paddle1["position"]["x"]) / (self.paddle_width / 2)
			ball["velocity"]["x"] += impact_offset * 0.2  # Add spin based on offset

			# Ensure the ball moves out of the paddle to avoid sticking
			ball["position"]["z"] = paddle1["position"]["z"] - 1 - ball["radius"]

		# Paddle 2 collision
		if (ball["position"]["z"] - ball["radius"] < paddle2["position"]["z"] + 1
				and paddle2["position"]["x"] - self.paddle_width / 2
				<= ball["position"]["x"] <= paddle2["position"]["x"] + self.paddle_width / 2):
			ball["velocity"]["z"] *= -1
			ball["speed"] += DELTA_SPEED;

			# Adjust x velocity based on impact point
			impact_offset = (ball["position"]["x"] - paddle2["position"]["x"]) / (self.paddle_width / 2)
			ball["velocity"]["x"] += impact_offset * 0.2  # Add spin based on offset

			# Ensure the ball moves out of the paddle to avoid sticking
			ball["position"]["z"] = paddle2["position"]["z"] + 1 + ball["radius"]

		# Ball goes out of bounds (scoring)
		if ball["position"]["z"] + ball["radius"] > self.boundaries["y"] - 1:
			paddle1["score"] += 1
			await self.reset_ball()
		elif ball["position"]["z"] - ball["radius"] < -self.boundaries["y"] + 1:
			paddle2["score"] += 1
			await self.reset_ball()

	async def reset_ball(self):
		angle = 30
		direction_x = random.choice([-1, 1])
		direction_z = random.choice([-1, 1])
		self.game_state["ball"] = {
			"position": {"x": 0, "y": 0, "z": 0},
			"velocity": {
				"x": direction_x * 0.2 * math.cos(angle),
				"z": direction_z * 0.2 * math.sin(angle),
			},
			"speed":START_SPEED,
			"radius": 0.5,
		}

	async def game_loop(self):
		while not self.game_state["over"]:
			self.game_state["ball"]["position"]["x"] += self.game_state["ball"]["velocity"]["x"] * self.game_state["ball"]["speed"]
			self.game_state["ball"]["position"]["z"] += self.game_state["ball"]["velocity"]["z"] * self.game_state["ball"]["speed"]
			self.game_state["players"]["paddle1"]["position"]["x"] += self.game_state["players"]["paddle1"]["dx"]
			self.game_state["players"]["paddle2"]["position"]["x"] += self.game_state["players"]["paddle2"]["dx"]
			await self.ball_collision()

			if (self.game_state["players"]["paddle1"]["score"] >= 5
				or self.game_state["players"]["paddle2"]["score"] >= 5):
				self.game_state["over"] = True
			await self.send_game_state()
			await asyncio.sleep(1 / 60)

	async def receive(self, text_data):
		data = json.loads(text_data)
		if 'start' in data:
			self.init_game()
			await self.send_game_state()
		if data["type"] == "paddle_movement":
			player_id = data["player_id"]
			paddle_dy = data["paddle_dy"]

			if player_id == "player1":
				self.game_state["players"]["paddle1"]["dx"] = paddle_dy
			elif player_id == "player2":
				self.game_state["players"]["paddle2"]["dx"] = paddle_dy
	
	async def disconnect(self, code):
		return await super().disconnect(code)

	async def send_game_state(self):
		await self.send(
			text_data=json.dumps({"action": "update", "game_state": self.game_state})
		)

class localTournamentConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.boundaries = {"x": 18, "y": 27}
		self.paddle_width = 6
		self.ball_radius = 0.5
		await self.accept()

	async def init_tournament(self, tournament_data):
		self.tournament_state = {
			"rounds": {
				"round1": [
					{"name": tournament_data["rounds"]["round1"][0]["name"], "score": 0},
					{"name": tournament_data["rounds"]["round1"][1]["name"], "score": 0},
					{"name": tournament_data["rounds"]["round1"][2]["name"], "score": 0},
					{"name": tournament_data["rounds"]["round1"][3]["name"], "score": 0}
				],
				"round2": [
					{"name": "-", "score": 0},
					{"name": "-", "score": 0}
				],
				"final": {
					"name": "-",
				}
			},
			"current_round": "round1",
			"current_match": 0,  # 0: first match of round1, 1: second match of round1, 2: round2
			"match_complete": False,
			"match_status": None
		}
		await self.init_game()

	async def init_game(self):
		angle = 30
		direction = random.choice([-1, 1])
		self.game_state = {
			"ball": {
				'position': {'x': 0, 'y': 0, 'z': 0},
				'velocity': {'x': direction * 0.2, 'y': 0, 'z': direction * 0.2 * math.sin(angle)},
				'speed': START_SPEED,
				'radius': 0.5,
			},
			"players": {
				"paddle1": {
					'position': {'x': 0, 'y': 0, 'z': 26},
					'dx': 0,
					'score': 0,
				},
				"paddle2": {
					'position': {'x': 0, 'y': 0, 'z': -26},
					'dx': 0,
					'score': 0,
				}
			},
			'maxScore': 5,
			'over': False,
			'started': False,
		}

	async def start_match(self):
		current_round = self.tournament_state["current_round"]
		current_match = self.tournament_state["current_match"]
		
		if current_round == "round1":
			player1_idx = current_match * 2
			player2_idx = current_match * 2 + 1
			self.tournament_state["current_players"] = [
				self.tournament_state["rounds"]["round1"][player1_idx]["name"],
				self.tournament_state["rounds"]["round1"][player2_idx]["name"]
			]
		elif current_round == "round2":
			self.tournament_state["current_players"] = [
				self.tournament_state["rounds"]["round2"][0]["name"],
				self.tournament_state["rounds"]["round2"][1]["name"]
			]
			
		self.tournament_state["match_status"] = "in_progress"
		await self.init_game()
	
		await self.send(text_data=json.dumps({
            'action': 'match_start',
            'tournament_state': self.tournament_state,
            'game_state': self.game_state
        }))

	async def handle_match_end(self):
		current_round = self.tournament_state["current_round"]
		current_match = self.tournament_state["current_match"]
		
		if current_round == "round1":
			# Update scores
			player1_idx = current_match * 2
			player2_idx = current_match * 2 + 1
			
			self.tournament_state["rounds"]["round1"][player1_idx]["score"] = self.game_state["players"]["paddle1"]["score"]
			self.tournament_state["rounds"]["round1"][player2_idx]["score"] = self.game_state["players"]["paddle2"]["score"]
			
			#winner
			if self.game_state["players"]["paddle1"]["score"] > self.game_state["players"]["paddle2"]["score"]:
				winner_idx = player1_idx
			else:
				winner_idx = player2_idx
				
			winner_name = self.tournament_state["rounds"]["round1"][winner_idx]["name"]
			
			# Update round2 with winner
			self.tournament_state["rounds"]["round2"][current_match]["name"] = winner_name

			if current_match == 0:
				# First match complete, wait for second match
				self.tournament_state["current_match"] = 1
				self.tournament_state["match_status"] = "waiting"
			else:
				# Both round1 matches complete, prepare for round2
				self.tournament_state["current_round"] = "round2"
				self.tournament_state["current_match"] = 0
				self.tournament_state["match_status"] = "waiting"
				
		elif current_round == "round2":
			# Update round2 scores
			self.tournament_state["rounds"]["round2"][0]["score"] = self.game_state["players"]["paddle1"]["score"]
			self.tournament_state["rounds"]["round2"][1]["score"] = self.game_state["players"]["paddle2"]["score"]
			
			#winner
			winner_idx = 0 if self.game_state["players"]["paddle1"]["score"] > self.game_state["players"]["paddle2"]["score"] else 1
			winner_name = self.tournament_state["rounds"]["round2"][winner_idx]["name"]
			
			# Update final
			self.tournament_state["rounds"]["final"]["name"] = winner_name
			self.tournament_state["current_round"] = "final"
			self.tournament_state["match_status"] = "completed"
			await self.send(text_data=json.dumps({
            'action': 'tournament_ends',
            'tournament_state': self.tournament_state
        }))

		await self.send(text_data=json.dumps({
            'action': 'tournament_update',
            'tournament_state': self.tournament_state
        }))
	async def ball_collision(self):
		ball = self.game_state["ball"]
		paddle1 = self.game_state["players"]["paddle1"]
		paddle2 = self.game_state["players"]["paddle2"]

		if (ball["position"]["x"] + ball["radius"] > self.boundaries["x"]
				or ball["position"]["x"] - ball["radius"] < -self.boundaries["x"]):
			ball["velocity"]["x"] *= -1

		if (ball["position"]["z"] + ball["radius"] > paddle1["position"]["z"] - 1
				and paddle1["position"]["x"] - self.paddle_width / 2
				<= ball["position"]["x"] <= paddle1["position"]["x"] + self.paddle_width / 2):
			ball["velocity"]["z"] *= -1
			ball["speed"] += DELTA_SPEED;
 
			impact_offset = (ball["position"]["x"] - paddle1["position"]["x"]) / (self.paddle_width / 2)
			ball["velocity"]["x"] += impact_offset * 0.2  # Add spin based on offset

			# Ensure the ball moves out of the paddle to avoid sticking
			ball["position"]["z"] = paddle1["position"]["z"] - 1 - ball["radius"]

		# Paddle 2 collision
		if (ball["position"]["z"] - ball["radius"] < paddle2["position"]["z"] + 1
				and paddle2["position"]["x"] - self.paddle_width / 2
				<= ball["position"]["x"] <= paddle2["position"]["x"] + self.paddle_width / 2):
			ball["velocity"]["z"] *= -1
			ball["speed"] += DELTA_SPEED;

			impact_offset = (ball["position"]["x"] - paddle2["position"]["x"]) / (self.paddle_width / 2)
			ball["velocity"]["x"] += impact_offset * 0.2  # Add spin based on offset

			# Ensure the ball moves out of the paddle to avoid sticking
			ball["position"]["z"] = paddle2["position"]["z"] + 1 + ball["radius"]

		# Ball goes out of bounds (scoring)
		if ball["position"]["z"] + ball["radius"] > self.boundaries["y"] - 1:
			paddle1["score"] += 1
			await self.reset_ball()
		elif ball["position"]["z"] - ball["radius"] < -self.boundaries["y"] + 1:
			paddle2["score"] += 1
			await self.reset_ball()

	async def reset_ball(self):
		angle = 30
		direction_x = random.choice([-1, 1])
		direction_z = random.choice([-1, 1])
		self.game_state["ball"] = {
			"position": {"x": 0, "y": 0, "z": 0},
			"velocity": {
				"x": direction_x * 0.2 * math.cos(angle),
				"z": direction_z * 0.2 * math.sin(angle),
			},
			"speed":START_SPEED,
			"radius": 0.5,
		}

	async def receive(self, text_data):
		data = json.loads(text_data)
		
		if data.get("type") == "init_tournament":
			await self.init_tournament(data["tournament_data"])
			
		elif data.get("type") == "start_match":
			if self.tournament_state["match_status"] != "completed":
				await self.start_match()
				asyncio.create_task(self.game_loop())

		elif data.get("type") == "paddle_movement":
				player_id = data["player_id"]
				paddle_dy = data["paddle_dy"]

				if player_id == "player1":
					self.game_state["players"]["paddle1"]["dx"] = paddle_dy
				elif player_id == "player2":
					self.game_state["players"]["paddle2"]["dx"] = paddle_dy

	async def game_loop(self):
		while not self.game_state["over"]:
			self.game_state["ball"]["position"]["x"] += self.game_state["ball"]["velocity"]["x"] * self.game_state["ball"]["speed"]
			self.game_state["ball"]["position"]["z"] += self.game_state["ball"]["velocity"]["z"] * self.game_state["ball"]["speed"]
			self.game_state["players"]["paddle1"]["position"]["x"] += self.game_state["players"]["paddle1"]["dx"]
			self.game_state["players"]["paddle2"]["position"]["x"] += self.game_state["players"]["paddle2"]["dx"]
			
			await self.ball_collision()

			if (self.game_state["players"]["paddle1"]["score"] >= 3 or 
				self.game_state["players"]["paddle2"]["score"] >= 3):
				self.game_state["over"] = True
				await self.handle_match_end()
			
			# Broadcast game state
			await self.send(text_data=json.dumps({
                'action': 'game_update',
                'game_state': self.game_state
            }))
			await asyncio.sleep(1 / 60)