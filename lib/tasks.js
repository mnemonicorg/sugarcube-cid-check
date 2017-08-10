import Promise from 'bluebird';
import locs from './locations';

export const tasks = () => Promise.resolve([
  {
    label: 'Upload Date',
    field: 'dem.upload_date',
    type: 'free_text',
  },
  {
    label: 'Incident Date',
    field: 'dem.incident_date',
    type: 'free_text',
  },
  {
    label: 'Location (Place)',
    field: 'dem.location',
    type: 'single_choice',
    options: locs
  },
  {
    label: 'Weapons Used',
    field: 'dem.weapons_used',
    type: 'multiple_choice',
    options: [
      { label: 'Chemical Weapons' },
      { label: 'Chlorine Gas' },
      { label: 'Mustard Gas' },
      { label: 'Sarin' },
      { label: 'Cluster Munition' },
      { label: 'Incendiary Weapons' },
      { label: 'ZAB-2.5S' },
      { label: 'ShOAB-0.5' },
      { label: 'AO-2.5RT/RTM' },
      { label: 'SPBE' },
      { label: 'ZAB-2.5SM' },
      { label: 'PTAB-1M' },
      { label: 'RBK-500' },
      { label: 'Barrel Bomb' },
      { label: '9M79M Tochka' },
      { label: 'Drone' },
      { label: 'FAB-500 SHN' },
      { label: 'OFAB 250-270' },
      { label: 'Thermobaric weapon' },
      { label: 'Artillery' },
      { label: 'Rockets launchers' }]
  },
  {
    label: 'Collections',
    field: 'dem.collections',
    type: 'multiple_choice',
    options: [
      { label: 'Attacks against hospitals' },
      { label: 'Attacks against schools' },
      { label: 'Attacks against bakeries' },
      { label: 'Attacks against journalists' },
      { label: 'Attacks against markets' },
      { label: 'Attacks against mosques' },
      { label: 'Attacks against cultural property' },
      { label: 'Attacks against civilians' },
      { label: 'Attacks against water sources' },
      { label: 'Attacks against humanitarian relief personnel and objects' },
      { label: 'Civilian casualties as a result of alleged russian attacks' },
      { label: 'Civilian casualties as a result of alleged coalition attacks' },
      { label: 'Civilian casualties as a result of alleged attacks by armed groups' },
      { label: 'Civilian casualties as a result of alleged attacks by syrian goverment forces' },
      { label: 'Civilian casualties as a result of alleged attacks by pro-syrian goverment forces' },
      { label: 'Plunder and theft' },
      { label: 'Coalition airstrikes in Syria' },
      { label: 'Russian airstrikes in Syria' },
      { label: 'Other' },
    ]
  },
  {
    label: 'Verified',
    field: 'dem.verified',
    type: 'multiple_choice',
    options: [{
      label: 'TRUE'
    }, {
      label: 'FALSE'
    }]
  },
  {
    label: 'creator',
    field: 'dem.longitude',
    type: 'free_text',
  },
  {
    label: 'Longitude',
    field: 'dem.longitude',
    type: 'free_text',
  },
  {
    label: 'Latitude',
    field: 'dem.latitude',
    type: 'free_text',
  },
]);

export default {
  tasks
};
