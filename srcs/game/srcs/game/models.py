from django.db import models

class Player(models.Model):
	pid = models.AutoField(primary_key=True, unique=True)
	wins = models.IntegerField(default=0)
	losses = models.IntegerField(default=0)
	games = models.ManyToManyField("self", blank=True, through='Game', symmetrical=False)

class Game(models.Model):
	gid = models.AutoField(primary_key=True)
	p1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='p1')
	p2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='p2')
	p1_score = models.IntegerField(default=0)
	p2_score = models.IntegerField(default=0)
	winner = models.IntegerField(default=-1)
	loser = models.IntegerField(default=-1)

	class Meta:
		unique_together = None

	def set_score(self, player_score, oplayer_score):
		self.p1_score = player_score
		self.p2_score = oplayer_score
		self.save()

	def set_winner(self):
		if self.p1_score > self.p2_score:
			self.winner = self.p1.pid
			self.loser = self.p2.pid
		elif self.p2_score > self.p1_score:
			self.winner = self.p2.pid
			self.loser = self.p1.pid
		self.save()