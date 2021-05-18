import {
  IContent,
  ILocationContent,
  IMessage,
  ITextContent,
  LocationContent,
  TextContent,
} from '@zenvia/sdk';
import { Place, searchPlaces } from './places';

interface IBotSession {
  location?: ILocationContent;
  places?: Place[];
}

async function handleLocation(
  session: IBotSession,
  location: ILocationContent,
): Promise<IContent[]> {
  session.location = location;
  delete session.places;
  const response: ITextContent = {
    type: 'text',
    text: 'O que gostaria de procurar perto deste local?',
  };
  return [response];
}

async function handleText(
  session: IBotSession,
  text: string,
): Promise<IContent[]> {
  if (!session.location) {
    return [
      new TextContent('Olá seja bem vindo!'),
      new TextContent('Envie sua localização para receber informações sobre locais próximos.'),
    ];
  }

  if (text.toLowerCase() !== 'mais') {
    const { latitude, longitude } = session.location;
    session.places = await searchPlaces(latitude, longitude, text);
  }

  if (session.places?.length) {
    const currentPlace: Place = session.places.splice(0, 1)[0];
    const responses: IContent[] = [];
    if (currentPlace.geometry) {
      responses.push(new LocationContent(
        currentPlace.geometry.location.lng,
        currentPlace.geometry.location.lat,
        currentPlace.name,
        currentPlace.formatted_address,
      ));
    }
    responses.push(
      new TextContent(`*${currentPlace.name}* possui uma avaliação de *${currentPlace.rating}⭐* e foi avaliado por ${currentPlace.user_ratings_total} pessoas.`),
      new TextContent('Envie "mais" para outros locais, ou envie outro tipo de local para buscar. Se preferir envie uma nova localização.'),
    );
    return responses;
  }

  return [
    new TextContent('Envie envie outro tipo de local para buscar. Se preferir envie uma nova localização.'),
  ];
}

export async function run(session: IBotSession, message: IMessage): Promise<IContent[]> {
  const content = message.contents[0];

  if (content.type === 'location') {
    return handleLocation(session, content as ILocationContent);
  }
  if (content.type === 'text') {
    const { text } = (content as ITextContent);
    return handleText(session, text);
  }

  return [
    new TextContent('Envie sua localização para receber informações sobre locais próximos.'),
  ];
}
