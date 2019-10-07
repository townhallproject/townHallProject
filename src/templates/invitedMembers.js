export default (member) => (`<div class="input-group invited-members">
 <span class="input-group-addon">
   <input class="member-checkbox" type="checkbox" aria-label="..." id="${member.govtrack_id}">
 </span>
 <input type="text" class="form-control member-name" aria-label="..."  placeholder="Invited speaker" value="${member.displayName}" readonly="">
</div>`
)
