import "./ArrayWindowIterator"
let a = "Iltam Sumra Rashupti Elatim".split("");
for (let primaryWindow of a.windows(5)) {
    console.log(primaryWindow.content());   
}