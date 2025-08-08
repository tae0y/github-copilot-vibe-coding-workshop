
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Contoso.BlazorApp;
using Blazored.LocalStorage;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");


// Blazored.LocalStorage 및 AuthService DI 등록
builder.Services.AddBlazoredLocalStorage();
builder.Services.AddScoped<Contoso.BlazorApp.Services.AuthService>();

// PostApiService용 HttpClient (BaseAddress: http://localhost:8080)
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("http://localhost:8080/") });
builder.Services.AddScoped<Contoso.BlazorApp.Services.PostApiService>();

await builder.Build().RunAsync();
