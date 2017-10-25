NOTIFICATION_CONFIG = {
    u"COMMENT_ADDED": {
        u"SUBJECT": u"%(PROJECT_NAME)s | %(TASK_TITLE)s - new comment",
        u"MESSAGE": u"""<p>%(AUTHOR_NAME)s has added a comment to the task <b>%(TASK_TITLE)s</b> you are involved in.<br><br><a href="%(TASK_LINK)s">View it there</a>.</p>"""
    },
    u"USER_AFFECTED": {
        u"SUBJECT": u"%(PROJECT_NAME)s | %(TASK_TITLE)s - assignement",
        u"MESSAGE": u"""<p>You've been affected to the task <b>%(TASK_TITLE)s</b>.<br><br><a href="%(TASK_LINK)s">View it there</a>.</p>"""
    },
    u"APP_URL": u"http://localhost:5000",
    u"SMTP": {
        u"host": u"smtp.gmail.com",
        u"port": 587,
        u"email": u"dummy@gmail.com",
        u"password": u"test"
    },
    u"ACTIVE": True
}
