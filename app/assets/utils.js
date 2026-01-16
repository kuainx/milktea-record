export function getLogoUrl(logoFile){
  return '//v.ekuai.tech/tea/' + logoFile
}

export function formatLocalDate(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getBrandData(){
  const brands = await $fetch('/api/brands');
  const brandsList = brands?.map(brand => ({
    value: brand.id,
    label: brand.name,
    avatar: {
      src: getLogoUrl(brand.logo),
      alt: brand.name,
    },
  }));
  return brandsList
}