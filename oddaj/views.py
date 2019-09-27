from django.db.models import Sum
from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout, login
from oddaj.models import Donation, Institution, Category
# Create your views here.

class MainPage(View):
    def get(self,request):
        header = 1
        isloggedin = request.user.is_authenticated
        quanity = Donation.objects.aggregate(Sum('quanity'))
        fundacje = Institution.objects.all()
        counter = Donation.objects.all().distinct('institution_id').count()
        if isloggedin:
            username = request.user
            return render(request, 'index.html', {'quanity':quanity, 'fundacje':fundacje, 'counter':counter, 'isloggedin':isloggedin, 'username':username, 'header':header})
        else:
            return render(request, 'index.html', {'quanity': quanity, 'fundacje': fundacje, 'counter': counter, 'isloggedin':isloggedin, 'header':header})


class Login(View):
    def get(self,request):
        isloggedin = request.user.is_authenticated
        if isloggedin:
            username = request.user
            return render(request, 'login.html',{'isloggedin':isloggedin, 'username':username})
        else:
            return render(request, 'login.html',{'isloggedin':isloggedin})
    def post(self,request):
        username = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request,user)
            return HttpResponseRedirect('/')
        else:
            return HttpResponseRedirect('/register/')


class Register(View):
    def get(self,request):
        isloggedin = request.user.is_authenticated
        if isloggedin:
            username = request.user
            return render(request, 'register.html',{'isloggedin':isloggedin, 'username':username})
        else:
            return render(request, 'register.html',{'isloggedin':isloggedin})

    def post(self, request):
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        name = request.POST.get('name')
        surname = request.POST.get('surname')
        email = request.POST.get('email')
        checker = User.objects.filter(username=email).count()
        if password == password2 and checker == 0:
            u = User(username=email, first_name=name,
                     last_name=surname, email=email)
            u.set_password(password)
            u.save()
            return HttpResponseRedirect('/login/')
        else:
            err = 'Niepoprawne dane'
            return render(request, 'register.html', {'err': err})

class Formularz(View):
    def get(self, request):
        header = 2
        isloggedin = request.user.is_authenticated
        categories2 = Category.objects.all()
        organizations = Institution.objects.all().order_by('type')
        if isloggedin:
            username = request.user
            return render(request, 'form.html', {'username':username, 'isloggedin':isloggedin, 'categories2':categories2, 'organizations':organizations, 'header':header})
        else:
            return HttpResponseRedirect('/login/')
    def post(self,request):
        categories = request.POST.getlist('categories')
        bags = request.POST.get('bags')
        organization = int(request.POST.get('organization'))
        address = request.POST.get('address')
        city = request.POST.get('city')
        postcode = request.POST.get('postcode')
        phone = int(request.POST.get('phone'))
        data = request.POST.get('data')
        time = request.POST.get('time')
        more_info = request.POST.get('more_info')
        x = Institution.objects.get(id=organization)
        u = Donation.objects.create(quanity=bags,institution=x,address=address,city=city,user=request.user,
                 zip_code=postcode, pick_up_date=data, pick_up_time=time, pick_up_comment=more_info,phone_number=phone)
        u.categories.set(categories)
        u.save()
        return HttpResponseRedirect('/form-conf/')




class FormConfirmation(View):
    def get(self,request):
        isloggedin = request.user.is_authenticated
        if isloggedin:
            username = request.user
            return render(request, 'form-confirmation.html',{'isloggedin':isloggedin, 'username':username})
        else:
            return render(request, 'form-confirmation.html', {'isloggedin': isloggedin})


class Logout(View):
    def get(self,request):
        logout(request)
        return HttpResponseRedirect('/')

class UserSite(View):
    def get(self,request):
        donations = Donation.objects.filter(user_id=request.user.id).order_by('is_taken')
        isloggedin = request.user.is_authenticated
        if isloggedin:
            username = request.user
            return render(request, 'usersite.html',{'isloggedin':isloggedin, 'username':username, 'donations':donations})
        else:
            return HttpResponseRedirect('/login/')

    def post(self,request):
        confirmation = request.POST.get('is_taken')
        donate = Donation.objects.get(id=confirmation)
        if donate.is_taken == False:
            donate.is_taken = True
        elif donate.is_taken == True:
            donate.is_taken = False
        donate.save()
        return HttpResponseRedirect('/user/')

class UserSettings(View):
    def get(self,request):
        isloggedin = request.user.is_authenticated
        if isloggedin:
            username = request.user
            return render(request, 'settings.html', {'isloggedin':isloggedin, 'username':username})
        else:
            return HttpResponseRedirect('/login/')

    def post(self, request):
        if 'changedata' in request.POST:
            passwordcheck = request.user.check_password(request.POST.get('password'))
            if passwordcheck:
                user = User.objects.get(username=request.user)
                user.username = request.POST.get('email')
                user.email = request.POST.get('email')
                user.first_name = request.POST.get('name')
                user.last_name = request.POST.get('surname')
                user.save()
        elif 'changepassword' in request.POST:
            passwordcheck = request.user.check_password(request.POST.get('current_password'))
            if passwordcheck and request.POST.get('new_password') == request.POST.get('repeat_password'):
                request.user.set_password(request.POST.get('new_password'))
                request.user.save()
        return HttpResponseRedirect('/settings/')