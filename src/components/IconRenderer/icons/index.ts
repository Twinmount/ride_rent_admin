// import ClockOutlined from './ClockOutlined';
import Pub from "./Pub";
import ResidentialArea from "./ResidentialArea";
import ResidentialBuildings from "./ResidentialBuildings";
import Waterfall from "./Waterfall";
import Wildlife from "./Wildlife";
import Windmill from "./Windmill";
import Zoo from "./Zoo";
import Airport from "./Airport";
import AmusementPark from "./AmusementPark";
import Aquarium from "./Aquarium";
import ArtGallery from "./ArtGallery";
import Bar from "./Bar";
import Beach from "./Beach";
import BeachUmbrella from "./BeachUmbrella";
// import Wildlife from './Wildlife';
// ...other imports

export const icons = {
  //   clock: ClockOutlined,
  pub: Pub,
  residentialArea: ResidentialArea,
  wildlife: Wildlife,
  residentialBuildings: ResidentialBuildings,
  zoo: Zoo,
  waterfall: Waterfall,
  windmill: Windmill,
  airport: Airport,
  amusementPark: AmusementPark,
  aquarium: Aquarium,
  artGallery: ArtGallery,
  bar: Bar,
  beach: Beach,
  beachUmbrella: BeachUmbrella,
};

export type IconName = keyof typeof icons;
