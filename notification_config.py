NOTIFICATION_CONFIG = {
    u"COMMENT_ADDED": {
        u"SUBJECT": u"A task you are affected to has been commented.",
        u"MESSAGE": u"""<p>The task <b>%(TASK_NAME)s</b> you are involved in has been commented.<br>To reach the comment, click <a href="%(LINK)s">there</a>.</p>"""
    },
    u"USER_AFFECTED": {
        u"SUBJECT": u"You've been affected to a task.",
        u"MESSAGE": u"""<p>You've been affected to the task <b>%(TASK_NAME)s.</b>You can reach it <a href="%(LINK)s">there</a>.</p>"""
    },
    u"APP_URL": u"http://localhost:5000",
    u"SMTP": {
        u"host": u"smtp.gmail.com",
        u"port": 587,
        u"email": u"dumb@gmail.com",
        u"password": u"password"
    },
    u"ACTIVE": False
}
