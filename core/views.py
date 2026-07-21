from django.shortcuts import render, redirect
from .models import Course
from django.contrib import messages
from django.core.mail import send_mail
from .models import Course, Job, Application

def home(request):
    featured_courses = Course.objects.filter(is_active=True)[:4]
    return render(request, 'core/home.html', {'featured_courses': featured_courses})


def about(request):
    return render(request, 'core/about.html')


def courses(request):
    it_courses = Course.objects.filter(is_active=True, category='IT')
    non_it_courses = Course.objects.filter(is_active=True, category='NON_IT')
    return render(request, 'core/courses.html', {
        'it_courses': it_courses,
        'non_it_courses': non_it_courses,
    })


def placements(request):
    return render(request, 'core/placements.html')


def careers(request):
    open_jobs = Job.objects.filter(is_active=True)
    return render(request, 'core/careers.html', {'open_jobs': open_jobs})


def contact(request):
    return render(request, 'core/contact.html')


def submit_application(request):
    if request.method == 'POST':
        application_type = request.POST.get('application_type')
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        college = request.POST.get('college', '')
        address = request.POST.get('address', '')
        course_id = request.POST.get('course_id')
        job_id = request.POST.get('job_id')
        resume = request.FILES.get('resume')

        course = Course.objects.filter(id=course_id).first() if course_id else None
        job = Job.objects.filter(id=job_id).first() if job_id else None

        application = Application.objects.create(
            application_type=application_type,
            course=course,
            job=job,
            name=name,
            email=email,
            phone=phone,
            college_or_degree=college,
            address=address,
            resume=resume,
        )

        subject_target = course.title if course else (job.title if job else 'General')
        send_mail(
            subject=f'New Enrollment — {subject_target}',
            message=f'Name: {name}\nEmail: {email}\nPhone: {phone}\nCollege/Degree: {college}\nAddress: {address}\nFor: {subject_target}',
            from_email=None,
            recipient_list=['careers@rootsource.in'],
            fail_silently=True,
        )

        messages.success(request, f'Thank you {name}! Your request for {subject_target} has been received.')
        return redirect(request.META.get('HTTP_REFERER', 'home'))

    return redirect('home')