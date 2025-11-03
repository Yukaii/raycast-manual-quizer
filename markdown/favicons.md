Within Raycast, we make use of favicons to enrich the look and feel of links. It’s surprisingly hard to fetch those icons consistently. We need to make a network request for those nice little icons in exchange for the domain of the link.

## Customize Favicon Provider

For maximum flexibility, we offer our users the option to select the underlying favicon provider via Raycast Settings → Advanced → Favicon Provider.

![Favicon provider setting](https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/6aa2887e-69cc-4575-a072-4e02aa37f3bb/CleanShot_2025-04-07_at_2_.46.382x/w=3840,quality=90,fit=scale-down)

Favicon provider setting

Each provider comes with different trade-offs:

1.  **None:** This disables the fetching of favicons throughout Raycast. Note that third-party extensions might still decide to fetch favicons.
2.  **Apple:** This provider makes use of Apple’s Link Presentation framework which tries to directly find the favicon on the domain’s server from the client.
3.  **DuckDuckGo:** This provider makes use of DuckDuckGo’s public endpoint.
4.  **Google:** This provider makes use of Google’s public endpoint at https://google.com/s2/favicons.
5.  **Raycast:** This provider makes use of our own public endpoint at https://api.ray.so/favicons. It’s open source as well.

## Disable Fetching of Favicons

We also allow you to disable fetching visual information for links for Quicklinks and the Clipboard History. Those settings allow fine-tuning when you want to show favicons inside Raycast.

![Favicons setting in Quicklinks](https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/ceb47230-ecae-4684-b46d-719bde095c68/CleanShot_2025-04-07_at_2_.49.382x/w=3840,quality=90,fit=scale-down)

Favicons setting in Quicklinks

![Favicons setting in Clipboard History](https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/661e015d-d6fd-4fca-a8e2-0f260fbf900f/CleanShot_2025-04-07_at_2_.47.442x/w=3840,quality=90,fit=scale-down)

Favicons setting in Clipboard History