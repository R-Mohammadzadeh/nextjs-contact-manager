

export const generateContactFilter = (userId , queryParams = {}) => {
const {gen , search} = queryParams ;

// Basic filter (security: always only user's own contacts)
const filter = {userId} ;
const gender = ['male' , 'female' ,'others'] ;
// Filter by gender
if(gen && gender.includes(gen)) {
    filter.gender = gen ;
}

// Filter by search (first name, last name, phone number)

if(search && search.trim() !== ''){
    // Escape special regex characters to prevent query injection or errors
    const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") ;
    const searchRegex = new RegExp(safeSearch , 'i')
    filter.$or = [
        {firstName :searchRegex },
        {lastName :searchRegex },
        {phone : searchRegex},
    ]
}
return filter
}