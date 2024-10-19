/*=============== SHOW SIDEBAR ===============*/
const showSidebar = (toggleId, sidebarId, headerId, mainId) =>{
    const toggle = document.getElementById(toggleId),
          sidebar = document.getElementById(sidebarId),
          header = document.getElementById(headerId),
          main = document.getElementById(mainId)
 
    if(toggle && sidebar && header && main){
        toggle.addEventListener('click', ()=>{
            /* Show sidebar */
            sidebar.classList.toggle('show-sidebar')
            /* Add padding header */
            header.classList.toggle('left-pd')
            /* Add padding main */
            main.classList.toggle('left-pd')
        })
    }
 }
 showSidebar('header-toggle','sidebar', 'header', 'main')
 
 /*=============== LINK ACTIVE ===============*/
 const sidebarLink = document.querySelectorAll('.sidebar__list a')
 
 function linkColor(){
     sidebarLink.forEach(l => l.classList.remove('active-link'))
     this.classList.add('active-link')
 }
 
 sidebarLink.forEach(l => l.addEventListener('click', linkColor))
 
 /*=============== DARK LIGHT THEME ===============*/ 
 const themeButton = document.getElementById('theme-button')
 const darkTheme = 'dark-theme'
 const iconTheme = 'ri-sun-fill'
 
 // Previously selected topic (if user selected)
 const selectedTheme = localStorage.getItem('selected-theme')
 const selectedIcon = localStorage.getItem('selected-icon')
 
 // We obtain the current theme that the interface has by validating the dark-theme class
 const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
 const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-clear-fill' : 'ri-sun-fill'
 
 // We validate if the user previously chose a topic
 if (selectedTheme) {
   // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
   document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
   themeButton.classList[selectedIcon === 'ri-moon-clear-fill' ? 'add' : 'remove'](iconTheme)
 }
 
 // Activate / deactivate the theme manually with the button
 themeButton.addEventListener('click', () => {
     // Add or remove the dark / icon theme
     document.body.classList.toggle(darkTheme)
     themeButton.classList.toggle(iconTheme)
     // We save the theme and the current icon that the user chose
     localStorage.setItem('selected-theme', getCurrentTheme())
     localStorage.setItem('selected-icon', getCurrentIcon())
 })
 // Function to draw lines between icons
function drawLineBetweenIcons(icon1, icon2, svgContainer) {
    const icon1Rect = icon1.getBoundingClientRect();
    const icon2Rect = icon2.getBoundingClientRect();
  
    const svgNS = "http://www.w3.org/2000/svg";
    const line = document.createElementNS(svgNS, "line");
  
    // Start point of the line (center of the first icon)
    const startX = icon1Rect.left + icon1Rect.width / 2;
    const startY = icon1Rect.top + icon1Rect.height / 2;
  
    // End point of the line (center of the second icon)
    const endX = icon2Rect.left + icon2Rect.width / 2;
    const endY = icon2Rect.top + icon2Rect.height / 2;
  
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
  
    line.classList.add("line");
    svgContainer.appendChild(line);
  }
  
  // Function to draw all connections
  function drawConnections() {
    const svgContainer = document.getElementById('svgContainer');
    svgContainer.innerHTML = ''; // Clear previous lines
  
    const managerIcon = document.getElementById('managerIcon');
    const routerIcon = document.getElementById('routerIcon');
    const clientIcons = document.querySelectorAll('.clientIcon');
  
    // Draw line between manager and router
    drawLineBetweenIcons(managerIcon, routerIcon, svgContainer);
  
    // Draw lines between router and each client
    clientIcons.forEach(clientIcon => {
      drawLineBetweenIcons(routerIcon, clientIcon, svgContainer);
    });
  }
  
  // Call drawConnections on window resize to adjust line positions
  window.addEventListener('resize', drawConnections);
  
  // Initialize the connections when the DOM is ready
  document.addEventListener('DOMContentLoaded', drawConnections);


  // JavaScript can be used for more dynamic interactions in the future
document.addEventListener("DOMContentLoaded", () => {
    console.log("Network Diagram Loaded");
    // Future enhancements can be added here
  });
  
  