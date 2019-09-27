from django.contrib.auth.models import User
from django.db import models

# Create your models here.

Fundacja = (
    (1, "Fundacja"),
    (2, "Organizacja Pozarządowa"),
    (3, "Zbiórka lokalna"),
)

class Category(models.Model):
    name = models.CharField(max_length=256)
    def __str__(self):
        ret = self.name
        return ret

class Institution(models.Model):
    name = models.CharField(max_length=256)
    description = models.TextField()
    type = models.IntegerField(choices=Fundacja, default=1)
    categories = models.ManyToManyField(Category)
    def __str__(self):
        ret = self.name
        return ret
    class Meta:
        unique_together = ['name']

class Donation(models.Model):
    quanity = models.IntegerField()
    categories = models.ManyToManyField(Category)
    institution = models.ForeignKey(Institution, on_delete=models.DO_NOTHING)
    address = models.CharField(max_length=256)
    phone_number = models.IntegerField()
    city = models.CharField(max_length=128)
    zip_code = models.CharField(max_length=6)
    pick_up_date = models.DateField()
    pick_up_time = models.TimeField()
    pick_up_comment = models.TextField()
    user = models.ForeignKey(User, null=True, default=None, on_delete=models.DO_NOTHING)
    is_taken = models.BooleanField(default=False)