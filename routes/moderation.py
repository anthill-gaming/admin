# For more details about routing, see
# http://www.tornadoweb.org/en/stable/routing.html
from tornado.web import url
from anthill.framework.utils.urls import include, root
from admin.handlers import moderation as handlers, LogRequestHandler


@root(pattern=r'^/moderation/', namespace='moderation')
def route_patterns():
    return [
        url(r'^/?$', handlers.IndexHandler, name='index'),
        url(r'^/moderations/?$', handlers.IndexHandler, name='moderation_list'),
        url(r'^/moderations/(?P<moderation_id>[^/]+)/?$', handlers.ModerationDetailHandler,
            name='moderation_detail'),
        url(r'^/log/?$', LogRequestHandler, {'service_name': 'moderation'}, name='log')
    ]
