from ._base import ServicePageHandler, ServiceFormHandler
from anthill.framework.handlers.edit import FormMixin, ProcessFormMixin


class VotePageHandler(ServicePageHandler):
    service_name = 'vote'


class VoteFormHandler(FormMixin, ProcessFormMixin, VotePageHandler):
    pass


class IndexHandler(VotePageHandler):
    page_name = 'index'

    async def get_context_data(self, **kwargs):
        context = await super().get_context_data(**kwargs)
        return context
