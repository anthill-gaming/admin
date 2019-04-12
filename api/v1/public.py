from graphene_sqlalchemy import SQLAlchemyObjectType
from admin import models
import graphene


class ServiceMetadata(graphene.ObjectType):
    """Service metadata entry."""

    name = graphene.String()
    title = graphene.String()
    description = graphene.String()
    icon_class = graphene.String()
    color = graphene.String()
    version = graphene.String()
    debug = graphene.Boolean()
    public_api_url = graphene.String()
    log_url = graphene.String()
    uptime = graphene.Int()

    def __lt__(self, other):
        return self.name < other.name


class RootQuery(graphene.ObjectType):
    """Api root query."""

    services_metadata = graphene.List(ServiceMetadata, description='List of services metadata.')

    @staticmethod
    async def resolve_services_metadata(root, info, **kwargs):
        handler = info.context['handler']
        services_metadata = handler.settings['services_meta']
        services_metadata = sorted(map(lambda m: ServiceMetadata(**m), services_metadata))
        return services_metadata


class Mutation(graphene.ObjectType):
    pass


# noinspection PyTypeChecker
schema = graphene.Schema(query=RootQuery)
