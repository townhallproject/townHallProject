
export default (districts) => {
  return districts.map(district => {
    `<li><a data-value=${district} href="#">${district}</a></li>`
  }).join('');
}
