from flask import Flask, url_for, send_from_directory, current_app, request,redirect, render_template
import flask
import datetime
from zoneinfo import ZoneInfo
import os
import werkzeug
from dotenv import load_dotenv

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import DateTime

template_dir = os.path.abspath('./wall03web')
app = Flask(__name__,template_folder=template_dir)
load_dotenv()
app.config.from_prefixed_env()

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
app.config["SQLALCHEMY_DATABASE_URI"] = app.config["SQLALCHEMY_DATABASE_URI"]
db.init_app(app)

class Blogs(db.Model):
    __tablename__ = 'blogs'
    id: Mapped[int] = mapped_column(primary_key=True,autoincrement=True, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    icon: Mapped[dict] = mapped_column(JSONB, nullable=True)
    content: Mapped[str] = mapped_column(nullable=True)
    imagePath: Mapped[str] = mapped_column(nullable=True)
    author: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column()
    date: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc),nullable=True)

    @property
    def date_est(self):
        return self.date.astimezone(ZoneInfo("America/New_York"))
    
with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return flask.send_file('index.html')

@app.post('/write_blog')
def write_blog():
    new_blog = Blogs(
        content=request.form.get('content'),
        imagePath=request.form.get('imglink'),
        description=request.form.get('desc'),
        author=request.form.get('author'),
        title=request.form.get('title'),
        date=datetime.datetime.now(datetime.timezone.utc),
        icon=request.form.get('icon')
    )
    db.session.add(new_blog)
    db.session.commit()
    return redirect('/')

@app.post('/blog/nothing.html')
def checkAccount():
    password = request.form.get('password')
    # Retrieve the password from environment variables
    correct_password = app.config["PASSWORD"]
    
    if password == correct_password:
        return render_template('blog/post.html')
    else:
        return redirect('/')

@app.route('/blog/')
def blog_page():
    blogs = db.session.execute(db.select(Blogs).order_by(Blogs.date.desc())).scalars()
    return render_template('blog/index.html',blogs=blogs)

@app.route('/blog/<int:blogid>.html')
def renderBlog(blogid):
    if blogid == 'nothing.html':
        return render_template('blog/nothing.html')
    blog = db.get_or_404(Blogs, blogid)
    return render_template('blog/0000.html',blog=blog)

@app.route('/blog/post.html')
def redirect_login():
    return render_template('blog/nothing.html')

@app.route("/<path:name>")
def download_file(name):
    try:
        return flask.send_from_directory(app.root_path, name)
    except werkzeug.exceptions.NotFound as e:
        if name.endswith("/"):
            return flask.send_from_directory(app.root_path, name + "index.html")
        raise e

@app.errorhandler(404)
def error(error):
    return flask.send_file('404.html'), 404