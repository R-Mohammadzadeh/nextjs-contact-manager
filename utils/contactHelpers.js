

export const generateContactFilter = (userId , queryParams = {}) => {
const {gen , search} = queryParams ;

// Basic filter (security: always only user's own contacts)
const filter = {userId} ;

// Filter by gender
if(gen && gen !== 'all' && gen !== '') {
    filter.gender = gen ;
}

// Filter by search (first name, last name, phone number)

if(search && search.trim() !== ''){
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") ;
    filter.$or = [
        {firstName : {$regex : safeSearch , $options : 'i'}},
        {lastName : {$regex : safeSearch , $options : 'i'}},
        {phone : {$regex : safeSearch , $options : 'i'}},
    ]
}
return filter
}